const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
              const user = context;
              const userData = await User.findById(user.user._id);
              console.log(userData)
              return userData;
            }
        },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
            throw new AuthenticationError('You need to be logged in');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            console.log('hello')
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: { savedBooks: bookData },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                    );
                }
            throw new AuthenticationError('You need to be logged in');
        },
        removeBook: async (parent, { userId, bookId }) => {
                return User.findOneAndUpdate(
                    { _id: userId },
                    { $pull: { savedBooks: { bookId: bookId} }},
                    { new: true }
                );
            }
        },
    };
module.exports = resolvers;
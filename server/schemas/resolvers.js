const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            console.log(context)
              const user = await context;
              return {
                _id: user.user._id,
                username: user.user.username,
                bookCount: user.body.query.bookCount,
                savedBooks: user.body.query.savedBooks
              };
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
        removeBook: async (parent, { savedBook }, context) => {
            if (context.user)
            try {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: savedBook }},
                    { new: true }
                );
            } catch (err) {
                console.log(err)
            }
            throw new AuthenticationError('You need to be logged in');
        },
    },
};

module.exports = resolvers;
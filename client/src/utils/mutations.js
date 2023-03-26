import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!, $token: String!) {
    addUser(username: $username, email: $email, password: $password, token: $token) {
      token
      user {
        _id
        username
      }
    }
  }
`;


export const SAVE_BOOK = gql`
  mutation saveBook($bookId: String, $authors: [String], $title: String, $description: String, $image: String, $link: String) {
    saveBook(bookId: $bookId, authors: $authors, title: $title, description: $description, image: $image, link: $link) {
      _id
      username
      savedBooks {
        _id
        authors
        title
        description
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String) {
    removeBook(bookId: $bookId) {
      bookId
    }
  }
`;
import { gql } from '@apollo/client';

export const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        email
        name
        role
        onboarded
      }
    }
  }
`;

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($email: String!, $password: String!, $name: String!) {
    registerUser(email: $email, password: $password, name: $name) {
      token
      user {
        _id
        email
        name
        role
        onboarded
      }
    }
  }
`; 
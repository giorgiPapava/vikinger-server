import { gql } from 'apollo-server';

const typeDefs = gql`
  scalar Date

  type Query {
    users: [User!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!, firstName: String!, lastName: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    token: String
    user: User
  }

  type User {
    id: ID!
    email: String!
    createdAt: Date!
    updatedAt: Date!
    googleId: String
    username: String
    password: String
    profile: Profile
  }

  type Profile {
    id: ID!
    userId: ID!
    firstName: String
    lastName: String
    bio: String
  }

  type Subscription {
    newUser: User
  }
`;

export default typeDefs;

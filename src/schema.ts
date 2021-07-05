import { gql } from 'apollo-server';

const typeDefs = gql`
  scalar Date

  type Query {
    users: [User!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    token: String
    user: User
  }

  type User {
    id: ID!
    username: String!
    password: String!
    email: String!
    createdAt: Date!
    updatedAt: Date!
    profile: Profile
  }

  type Profile {
    id: ID!
    bio: String
    userId: ID!
  }
`;

export default typeDefs;

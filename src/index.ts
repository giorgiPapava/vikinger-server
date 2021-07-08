import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import express from 'express'
import jwt from 'jsonwebtoken';
import typeDefs from './schema';
import resolvers from './resolvers';
import { getUserId, APP_SECRET } from './utils';
import passport from './passport'

export const prisma = new PrismaClient();

export interface Context {
  prisma: typeof prisma;
  userId: number | null;
}

interface User {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  username?: any;
  password?: any;
  googleId: string;
}

async function main() {
  const app = express()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req.headers.authorization) : null,
    }),
  });

  server.applyMiddleware({ app })

  app.use(passport.initialize())
  app.listen({ port: 4000 })
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
      // eslint-disable-next-line prefer-destructuring
      const user = req.user as User
      const token = jwt.sign({ userId: user.id }, APP_SECRET);
      res.send({
        ...req.user,
        token,
      })
    });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

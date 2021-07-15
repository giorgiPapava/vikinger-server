import { PrismaClient } from '@prisma/client';
import { ApolloServer, makeExecutableSchema, PubSub } from 'apollo-server-express';
import express from 'express'
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import typeDefs from './schema';
import resolvers from './resolvers';
import { getUserId, APP_SECRET } from './utils';
import passport from './passport'
import { User } from './types'

const PORT = 4000
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export const prisma = new PrismaClient();
const pubsub = new PubSub()
const app = express()
const server = createServer(app);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req,
    prisma,
    pubsub,
    userId: req && req.headers.authorization ? getUserId(req.headers.authorization) : null,
  }),
});

export interface Context {
  prisma: typeof prisma;
  userId: number | null;
  pubsub: typeof pubsub
}

async function main() {
  apolloServer.applyMiddleware({ app, path: '/' })

  app.use(passport.initialize())
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

  server.listen(PORT, () => {
    // eslint-disable-next-line no-new
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
      onConnect: (headers: any) => ({
        prisma,
        pubsub,
        userId: headers.authorization ? getUserId(headers.authorization) : null,
      }),
    }, {
      server,
      path: '/graphql',
    });
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

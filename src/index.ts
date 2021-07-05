import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import typeDefs from './schema'
import resolvers from './resolvers'
import { getUserId } from './utils'

const prisma = new PrismaClient();

async function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      ...req,
      prisma,
      userId:
          req && req.headers.authorization
            ? getUserId(req)
            : null,
    }),
  });

  server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

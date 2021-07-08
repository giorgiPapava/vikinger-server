import { Context } from '../index';

const users = async (_parent: null, _args: null, context: Context) => context.prisma.user.findMany({
  include: {
    profile: true,
  },
})

export default {
  users,
};

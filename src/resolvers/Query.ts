const users = async (_parent: any, _args: any, context: any) =>
  context.prisma.user.findMany();

export default {
  users,
}

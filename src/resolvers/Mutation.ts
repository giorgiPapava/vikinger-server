import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MutationLoginArgs, MutationSignupArgs } from 'src/generated/graphql';
import { APP_SECRET } from '../utils';
import { Context } from '../index';

const signup = async (_parent: null, args: MutationSignupArgs, context: Context) => {
  const {
    email, firstName, lastName, password, username,
  } = args;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await context.prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      profile: {
        create: {
          firstName,
          lastName,
        },
      },
    },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const login = async (_parent: null, args: MutationLoginArgs, context: Context) => {
  const user = await context.prisma.user.findUnique({ where: { email: args.email } });

  if (!user || !user.password) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

export default {
  login,
  signup,
};

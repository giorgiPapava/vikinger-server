import { Context } from '../index';

// new user created
const newUserSubscribe = (_parent: null, _args: null, context: Context) => context.pubsub.asyncIterator('NEW_USER')
const newUser = {
  subscribe: newUserSubscribe,
  resolve: (payload: any) => payload,
}

export default {
  newUser,
}

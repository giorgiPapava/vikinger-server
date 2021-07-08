import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './index';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.google_client_id as string,
      clientSecret: process.env.google_client_secret as string,
      callbackURL: process.env.google_callback_url as string,
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      const {
        email,
        sub,
        // eslint-disable-next-line no-underscore-dangle
      } = profile._json;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const familyName = profile.name?.familyName;
      const givenName = profile.name?.givenName;

      let user = await prisma.user.findUnique({
        where: {
          googleId: sub,
        },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            googleId: sub,
            profile: {
              create: {
                firstName: givenName,
                lastName: familyName,
              },
            },
          },
        })
      }

      return cb(null, user);
    },
  ),
);

export default passport;

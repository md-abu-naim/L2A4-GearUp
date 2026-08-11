import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: config.google_callback_url,
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account email not found"), false);
        }

        let user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        // User doesn't exist → create user
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              password: null,
              role: "CUSTOMER",
              profileImage: profile.photos?.[0]?.value,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
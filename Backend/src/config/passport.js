import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.configDotenv();

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser(async (user, done) => {
  try {
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase() || null;

        let user = await User.findOne({ googleId: profile.id });
        if (!user && email) {
          user = await User.findOne({ email });
          if (user) return done(null, null);
        }

        let age = 0;

        if (profile.birthday) {
          const dob = new Date(profile.birthday);
          const ageDiffMs = Date.now() - dob.getTime();
          const ageDate = new Date(ageDiffMs);
          age = Math.abs(ageDate.getUTCFullYear() - 1970);
          console.log("User's age:", age);
        }

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email,
            username: profile.displayName,
            age,
            grade: "other",
          });
          return done(null, user);
        }

        return done(null, user);
      } catch (error) {
        console.log("Error in redirect: ", error);
        return done(error);
      }
    }
  )
);

export default passport;

import dotenv from "dotenv";
dotenv.config();

import passport from "passport";

import { Strategy as GoogleStrategy }
from "passport-google-oauth20";

import User from "../models/user.model.js";

console.log(process.env.GOOGLE_CLIENT_ID);
passport.use(

    new GoogleStrategy(

        {
            clientID: process.env.GOOGLE_CLIENT_ID,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            callbackURL:
                "/api/auth/google/callback",
        },

        async (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {

            try {

                let user = await User.findOne({
                    email: profile.emails[0].value,
                });


                // Create user if not exists
                if (!user) {

                    user = await User.create({

                        name: profile.displayName,

                        email: profile.emails[0].value,

                        password: "googleoauth",

                        isVerified: true,

                        profileImage:
                            profile.photos[0].value,
                    });
                }


                done(null, user);

            }

            catch (error) {

                done(error, null);
            }
        }
    )
);


export default passport;
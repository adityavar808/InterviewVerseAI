import dotenv from "dotenv";
dotenv.config();

import passport from "passport";

import { Strategy as GoogleStrategy }
from "passport-google-oauth20";

import User from "../models/user.model.js";

const defaultBackendUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === "production"
        ? "https://interviewverseai.onrender.com"
        : "http://localhost:5000");

const googleCallbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    `${defaultBackendUrl.replace(/\/+$/, "")}/api/auth/google/callback`;

passport.use(

    new GoogleStrategy(

        {
            clientID: process.env.GOOGLE_CLIENT_ID,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            callbackURL: googleCallbackURL,
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

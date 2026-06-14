import dotenv from "dotenv";
dotenv.config();

import passport from "passport";

import { Strategy as GoogleStrategy }
from "passport-google-oauth20";

import User from "../models/user.model.js";
import { resolveUserStatus } from "../utils/adminHelpers.js";

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
                const email =
                    profile.emails?.[0]?.value?.toLowerCase();

                if (!email) {
                    return done(null, false, {
                        message:
                            "Google account email is missing",
                    });
                }

                let user = await User.findOne({
                    email,
                });


                // Create user if not exists
                if (!user) {

                    user = await User.create({

                        name:
                            profile.displayName ||
                            email,

                        email,

                        password: "googleoauth",

                        isVerified: true,

                        profileSetupDone: false,

                        profileImage:
                            profile.photos?.[0]?.value ||
                            "",
                    });
                }
                else if (
                    resolveUserStatus(user) === "suspended"
                ) {
                    return done(null, false, {
                        message:
                            "Your account has been suspended",
                    });
                }
                else if (!user.isVerified) {
                    return done(null, false, {
                        message:
                            "Please verify your email first",
                    });
                }
                else if (
                    resolveUserStatus(user) !== "active"
                ) {
                    return done(null, false, {
                        message:
                            "Your account is inactive. Please contact support.",
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

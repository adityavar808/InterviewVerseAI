import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { setCredentials }
from "../../redux/slices/authSlice";


const OAuthSuccess = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();


    useEffect(() => {

        const params =
            new URLSearchParams(window.location.search);

        const token = params.get("token");


        console.log("TOKEN:", token);


        if (token) {

            dispatch(

                setCredentials({

                    accessToken: token,

                    user: null,
                })
            );


            localStorage.setItem(
                "accessToken",
                token
            );


            setTimeout(() => {

                navigate("/dashboard");

            }, 1000);
        }

    }, [dispatch, navigate]);


    return (

        <div className="min-h-screen bg-black text-white flex items-center justify-center">

            <h1 className="text-3xl font-bold text-cyan-400">

                Google Login Successful...

            </h1>

        </div>
    );
};

export default OAuthSuccess;
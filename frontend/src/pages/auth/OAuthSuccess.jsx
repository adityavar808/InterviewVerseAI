import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import toast from "react-hot-toast";

import { setCredentials }
from "../../redux/slices/authSlice";
import api from "../../services/api";


const OAuthSuccess = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();


    useEffect(() => {

        const syncOAuthSession = async () => {
            const params =
                new URLSearchParams(window.location.search);

            const token = params.get("token");

            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            localStorage.setItem("accessToken", token);

            dispatch(
                setCredentials({
                    accessToken: token,
                    user: null,
                })
            );

            try {
                const response = await api.get("/auth/me");
                const user = response.data.user;

                dispatch(
                    setCredentials({
                        accessToken: token,
                        user,
                    })
                );

                navigate(
                    user?.profileSetupDone === false
                        ? "/complete-profile"
                        : "/dashboard",
                    { replace: true }
                );
            } catch (error) {
                localStorage.removeItem("accessToken");
                toast.error(
                    error.response?.data?.message ||
                        "Unable to complete Google sign in"
                );
                navigate("/login", { replace: true });
            }
        };

        syncOAuthSession();

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

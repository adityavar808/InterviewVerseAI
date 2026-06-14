import { useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import toast from "react-hot-toast";

import { setCredentials, logout }
from "../../redux/slices/authSlice";
import { API_BASE_URL } from "../../config/urls";


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

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/auth/me`,
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const user = response.data.user;

                localStorage.setItem("accessToken", token);

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
                dispatch(logout());
                toast.error(
                    error.response?.data?.message ||
                        error.message ||
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

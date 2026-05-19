import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);

  const [timer, setTimer] = useState(60);

  // countdown timer

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // handle otp input

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const updatedOTP = [...otp];

    updatedOTP[index] = value.substring(0, 1);

    setOtp(updatedOTP);

    // move next input

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // verify otp

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      const enteredOTP = otp.join("");

      const response = await api.post("/auth/verify-otp", {
        email,
        otp: enteredOTP,
      });

      toast.success(response.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // resend otp

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);

      const response = await api.post("/auth/resend-otp", { email });

      toast.success(response.data.message);

      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#020617] flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card */}

      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-8 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",

          backdropFilter: "blur(24px)",

          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Heading */}

        <h1 className="text-3xl font-bold text-white text-center mb-3">
          Verify OTP
        </h1>

        <p className="text-slate-400 text-center text-sm mb-8">
          Enter the 6-digit OTP sent to
          <span className="text-cyan-400"> {email}</span>
        </p>

        {/* OTP Boxes */}

        <div className="flex justify-between gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-14 rounded-xl text-center text-xl font-semibold bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400"
            />
          ))}
        </div>

        {/* Verify Button */}

        <button
          onClick={handleVerifyOTP}
          disabled={loading}
          className="w-full py-3 rounded-xl text-[#020617] font-semibold transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
          }}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend */}

        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-slate-500 text-sm">
              Resend OTP in <span className="text-cyan-400">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

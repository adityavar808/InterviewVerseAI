import { useEffect, useRef, useState } from "react";

import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

const OTP_LENGTH = 6;

const VerifyOTP = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || sessionStorage.getItem("verificationEmail") || "";

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
      return;
    }

    sessionStorage.setItem("verificationEmail", email);
  }, [email, navigate]);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);

  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  // countdown timer

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [email]);

  // handle otp input

  const handleChange = (value, index) => {
    const sanitizedValue = value.replace(/\D/g, "").substring(0, 1);

    const updatedOTP = [...otp];

    updatedOTP[index] = sanitizedValue;

    setOtp(updatedOTP);

    if (sanitizedValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const updatedOTP = [...otp];
      updatedOTP[index - 1] = "";
      setOtp(updatedOTP);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!pastedValue) return;

    const updatedOTP = Array(OTP_LENGTH).fill("");

    for (let index = 0; index < pastedValue.length; index += 1) {
      updatedOTP[index] = pastedValue[index];
    }

    setOtp(updatedOTP);
    inputRefs.current[Math.min(pastedValue.length, OTP_LENGTH - 1)]?.focus();
  };

  // verify otp

  const handleVerifyOTP = async () => {
    if (!email) {
      toast.error("Verification email is missing. Please try again.");
      return;
    }

    const enteredOTP = otp.join("");

    if (enteredOTP.length !== OTP_LENGTH) {
      toast.error("Please enter the full 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        email,
        otp: enteredOTP,
      });

      sessionStorage.removeItem("verificationEmail");
      toast.success(response.data.message || "Email verified successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // resend otp

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Verification email is missing. Please try again.");
      return;
    }

    try {
      setResendLoading(true);

      const response = await api.post("/auth/resend-otp", { email });

      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(60);
      inputRefs.current[0]?.focus();

      toast.success(response.data.message || "OTP resent successfully");
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
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
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

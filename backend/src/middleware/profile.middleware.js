const requireProfileSetup = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  if (req.user?.profileSetupDone === false) {
    return res.status(403).json({
      success: false,
      message: "Please complete your profile first",
    });
  }

  return next();
};

export default requireProfileSetup;

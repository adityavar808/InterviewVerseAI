const adminDashboard = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Welcome Admin",
    });
};

export {
    adminDashboard,
};
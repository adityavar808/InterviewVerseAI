import {
  getPlatformSettingsDocument,
  sanitizeSettings,
} from "../../utils/adminHelpers.js";

const getSettings = async (req, res) => {
  try {
    const settings =
      await getPlatformSettingsDocument();

    return res.status(200).json({
      success: true,
      data: sanitizeSettings(
        settings,
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSettings = async (
  req,
  res,
) => {
  try {
    const settings =
      await getPlatformSettingsDocument();

    const fields = [
      "platformName",
      "supportEmail",
      "maintenanceMode",
      "allowRegistrations",
      "allowGoogleAuth",
      "dailyAiCreditLimit",
      "defaultInterviewDuration",
      "defaultInterviewDifficulty",
      "maxCodingQuestionsPerDay",
      "sessionTimeoutMinutes",
      "announcementBanner",
      "onboardingMessage",
      "docsUrl",
      "statusPageUrl",
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !==
        undefined
      ) {
        settings[field] =
          req.body[field];
      }
    });

    settings.updatedBy = req.user._id;

    await settings.save();

    return res.status(200).json({
      success: true,
      message:
        "Platform settings updated successfully",
      data: sanitizeSettings(
        settings,
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getSettings,
  updateSettings,
};

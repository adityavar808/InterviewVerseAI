import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import PlatformSetting from "../models/platformSetting.model.js";

const ensureDefaultAdmin = async () => {
  const adminEmail =
    process.env.ADMIN_EMAIL ||
    "superadmin@interviewverse.ai";

  const adminPassword =
    process.env.ADMIN_PASSWORD ||
    "Admin@123";

  const existingAdmin = await User.findOne({
    email: adminEmail,
  });

  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      console.warn(
        `User ${adminEmail} exists but is not an admin. Update the role manually if you want to use it as the admin account.`,
      );
    }

    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(
    adminPassword,
    10,
  );

  return User.create({
    name:
      process.env.ADMIN_NAME ||
      "Super Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
    status: "active",
    isVerified: true,
  });
};

const ensurePlatformSettings = async () => {
  const existingSettings =
    await PlatformSetting.findOne({
      key: "default",
    });

  if (existingSettings) {
    return existingSettings;
  }

  return PlatformSetting.create({
    key: "default",
  });
};

const bootstrapAdminData = async () => {
  await ensureDefaultAdmin();
  await ensurePlatformSettings();
};

export default bootstrapAdminData;

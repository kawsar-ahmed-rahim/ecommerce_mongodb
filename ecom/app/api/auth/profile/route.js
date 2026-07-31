import connectDB from "@/lib/db";
import { getAuthenticatedUser, sanitizeUser, verifyPassword } from "@/lib/auth";
import User from "@/models/User";

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    return Response.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Profile fetch failed", error);
    return Response.json({ error: "Profile fetch failed" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userSession = await getAuthenticatedUser(request);
    if (!userSession) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, currentPassword, newPassword } = body;

    await connectDB();
    const user = await User.findById(userSession._id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    if (newPassword) {
      if (!currentPassword || !verifyPassword(currentPassword, user.password)) {
        return Response.json(
          { error: "Current password is incorrect" },
          { status: 400 },
        );
      }
      user.password = require("crypto")
        .createHash("sha256")
        .update(
          `${process.env.AUTH_SECRET || "society-market-secret"}:${String(newPassword)}`,
        )
        .digest("hex");
    }

    await user.save();

    return Response.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Profile update failed", error);
    return Response.json({ error: "Profile update failed" }, { status: 500 });
  }
}

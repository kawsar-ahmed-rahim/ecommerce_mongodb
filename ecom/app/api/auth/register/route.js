import connectDB from "@/lib/db";
import { hashPassword, sanitizeUser } from "@/lib/auth";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone = "", address = "" } = body;

    if (!name || !email || !password) {
      return Response.json(
        { error: "Name, email and password are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: String(email).toLowerCase(),
    });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      password: hashPassword(password),
      phone,
      address,
    });

    return Response.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Register failed", error);
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}

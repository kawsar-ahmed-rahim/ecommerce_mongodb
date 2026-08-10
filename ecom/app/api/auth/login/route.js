import connectDB from "@/lib/db";
import {
  createSessionToken,
  ensureDefaultAdmin,
  serializeSessionCookie,
  verifyPassword,
  sanitizeUser,
} from "@/lib/auth";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    await connectDB();
    await ensureDefaultAdmin();

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user || !verifyPassword(password, user.password)) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createSessionToken(user._id.toString());

    return new Response(JSON.stringify({ user: sanitizeUser(user) }), {
      status: 200,
      headers: {
        "Set-Cookie": serializeSessionCookie(token),
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Login failed", error);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}

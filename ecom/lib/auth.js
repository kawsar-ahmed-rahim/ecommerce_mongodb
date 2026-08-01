import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";

const AUTH_SECRET = process.env.AUTH_SECRET || "society-market-secret";
export const DEFAULT_ADMIN_EMAIL = "admin@example.com";
export const DEFAULT_ADMIN_PASSWORD = "password";

export function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(`${AUTH_SECRET}:${String(password)}`)
    .digest("hex");
}

export function verifyPassword(password, storedHash) {
  return hashPassword(password) === storedHash;
}

export function createSessionToken(userId) {
  const randomPart = crypto.randomBytes(12).toString("hex");
  const payload = `${userId}:${Date.now()}:${randomPart}`;
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== signature) return null;

  const [userId] = payload.split(":");
  return userId || null;
}

export function serializeSessionCookie(token) {
  return `session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
}

export function clearSessionCookie() {
  return "session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}

export async function ensureDefaultAdmin() {
  await connectDB();

  const existingAdmin = await User.findOne({
    email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
  });

  if (existingAdmin) return existingAdmin;

  return User.create({
    name: "Admin",
    email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
    password: hashPassword(DEFAULT_ADMIN_PASSWORD),
    role: "admin",
    phone: "",
    address: "",
  });
}

export async function getAuthenticatedUser(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith("session="));

  if (!sessionCookie) return null;

  const token = decodeURIComponent(sessionCookie.split("=")[1] || "");
  const userId = verifySessionToken(token);

  if (!userId) return null;

  await connectDB();
  const user = await User.findById(userId).select("-password");
  return user;
}

export function sanitizeUser(user) {
  if (!user) return null;

  const userObject = user.toObject ? user.toObject() : user;
  const { password, ...rest } = userObject;
  return rest;
}

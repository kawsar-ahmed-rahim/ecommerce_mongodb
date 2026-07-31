import { getAuthenticatedUser, sanitizeUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    return Response.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Session fetch failed", error);
    return Response.json({ error: "Session fetch failed" }, { status: 500 });
  }
}

import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ phone: user.phone || "" })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(orders);
  } catch (error) {
    console.error("Order history fetch failed", error);
    return Response.json(
      { error: "Order history fetch failed" },
      { status: 500 },
    );
  }
}

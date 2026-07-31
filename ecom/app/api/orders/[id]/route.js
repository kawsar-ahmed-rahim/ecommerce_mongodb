import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuthenticatedUser } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (body.status) order.status = body.status;
    await order.save();
    return Response.json({ order });
  } catch (error) {
    console.error("Order update failed", error);
    return Response.json({ error: "Order update failed" }, { status: 500 });
  }
}

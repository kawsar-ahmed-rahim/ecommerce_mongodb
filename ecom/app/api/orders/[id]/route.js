import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const order = await Order.findById(params.id).lean();
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (
      user.role !== "admin" &&
      String(order.phone || "") !== String(user.phone || "")
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    return Response.json(order);
  } catch (error) {
    console.error("Order fetch failed", error);
    return Response.json({ error: "Order fetch failed" }, { status: 500 });
  }
}

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

import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { customerName, phone, address, deliveryNotes, items, subtotal } =
      body;

    const effectiveName = customerName || user.name || "";
    const effectivePhone = phone || user.phone || "";

    if (
      !effectiveName ||
      !effectivePhone ||
      !address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return Response.json(
        { error: "Please provide customer details and at least one item." },
        { status: 400 },
      );
    }

    await connectDB();

    const order = await Order.create({
      user: user._id,
      customerName: effectiveName,
      phone: effectivePhone,
      address,
      deliveryNotes: deliveryNotes || "",
      items: items.map((item) => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      })),
      subtotal,
    });

    return Response.json({ success: true, order });
  } catch (error) {
    console.error("Order creation failed:", error);
    return Response.json({ error: "Order creation failed" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return Response.json(orders);
  } catch (error) {
    console.error("Fetching orders failed:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

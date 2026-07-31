import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, deliveryNotes, items, subtotal } =
      body;

    if (
      !customerName ||
      !phone ||
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
      customerName,
      phone,
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

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return Response.json(orders);
  } catch (error) {
    console.error("Fetching orders failed:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

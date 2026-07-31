import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error("Product fetch failed", error);
    return Response.json({ error: "Product fetch failed" }, { status: 500 });
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
    const product = await Product.findById(params.id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    Object.assign(product, {
      title: body.title ?? product.title,
      description: body.description ?? product.description,
      price: body.price ?? product.price,
      category: body.category ?? product.category,
      image: body.image ?? product.image,
      stock: body.stock ?? product.stock,
      tags: body.tags ?? product.tags,
      isFeatured: body.isFeatured ?? product.isFeatured,
    });

    await product.save();
    return Response.json({ product });
  } catch (error) {
    console.error("Product update failed", error);
    return Response.json({ error: "Product update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Product delete failed", error);
    return Response.json({ error: "Product delete failed" }, { status: 500 });
  }
}

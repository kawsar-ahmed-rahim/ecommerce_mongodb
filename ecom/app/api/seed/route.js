import connectDB from "@/lib/db";
import { ensureDefaultAdmin } from "@/lib/auth";
import Product from "@/models/Product";
export async function GET() {
  await connectDB();
  await ensureDefaultAdmin();
  const products = await Product.find();
  await Product.deleteMany();
  await Product.insertMany([
    {
      title: "Blue Sneakers",
      description:
        "Comfortable and stylish blue sneakers perfect for everyday wear.",
      price: 19.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300?random=1",
    },
    {
      title: "Red T-Shirt",
      description:
        "Soft and breathable red t-shirt made from high-quality cotton.",
      price: 9.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Green Backpack",
      description:
        "Durable and spacious green backpack ideal for travel and outdoor activities.",
      price: 29.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Black Headphones",
      description:
        "Wireless headphones with premium sound quality and noise cancellation.",
      price: 49.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "White Hoodie",
      description: "Warm and cozy hoodie made from soft fleece fabric.",
      price: 24.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Smart Watch",
      description:
        "Track fitness, notifications, and daily activities with ease.",
      price: 79.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Leather Wallet",
      description: "Elegant wallet crafted from premium genuine leather.",
      price: 14.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Running Shoes",
      description: "Lightweight shoes designed for comfort and performance.",
      price: 34.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Gaming Mouse",
      description: "High-precision gaming mouse with customizable buttons.",
      price: 22.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Denim Jacket",
      description: "Classic denim jacket suitable for casual outings.",
      price: 39.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Travel Bag",
      description: "Large-capacity travel bag for weekend trips and vacations.",
      price: 44.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Bluetooth Speaker",
      description: "Portable speaker delivering rich sound and deep bass.",
      price: 27.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Sports Cap",
      description: "Breathable sports cap perfect for outdoor activities.",
      price: 8.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Formal Shirt",
      description: "Stylish formal shirt ideal for office and business events.",
      price: 18.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Laptop Stand",
      description: "Adjustable stand designed for ergonomic laptop use.",
      price: 16.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Canvas Shoes",
      description: "Trendy canvas shoes suitable for everyday casual wear.",
      price: 21.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Sunglasses",
      description: "UV-protected sunglasses with a modern stylish design.",
      price: 12.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Mechanical Keyboard",
      description:
        "Responsive keyboard with tactile switches for productivity.",
      price: 59.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Winter Sweater",
      description: "Soft knitted sweater that provides warmth and comfort.",
      price: 26.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Sports Bottle",
      description: "Reusable water bottle perfect for gym and travel.",
      price: 7.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Hiking Boots",
      description: "Durable boots built for hiking and rough terrains.",
      price: 54.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Wireless Earbuds",
      description: "Compact earbuds with crystal-clear audio quality.",
      price: 39.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Cargo Pants",
      description: "Comfortable cargo pants with multiple utility pockets.",
      price: 23.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Laptop Backpack",
      description: "Protective backpack designed specifically for laptops.",
      price: 31.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Fitness Tracker",
      description: "Monitor steps, heart rate, and daily fitness goals.",
      price: 45.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Loafers",
      description: "Elegant loafers suitable for both casual and formal wear.",
      price: 32.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Polo Shirt",
      description: "Classic polo shirt offering comfort and style.",
      price: 15.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Phone Holder",
      description: "Adjustable phone holder for desks and workspaces.",
      price: 6.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "USB Hub",
      description: "Expand connectivity with multiple USB ports.",
      price: 13.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Flip Flops",
      description: "Lightweight and comfortable flip flops for summer.",
      price: 11.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Joggers",
      description: "Comfortable joggers perfect for workouts and leisure.",
      price: 20.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Travel Pillow",
      description: "Ergonomic pillow designed for comfortable journeys.",
      price: 9.49,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Monitor Light",
      description: "LED light bar that reduces eye strain while working.",
      price: 28.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Basketball Shoes",
      description: "Performance basketball shoes with excellent grip.",
      price: 64.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Graphic Tee",
      description: "Fashionable t-shirt featuring unique graphic prints.",
      price: 12.49,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Key Organizer",
      description: "Keep your keys neatly organized and accessible.",
      price: 5.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Webcam",
      description: "HD webcam perfect for meetings and online classes.",
      price: 35.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Sandals",
      description: "Comfortable sandals for daily wear and travel.",
      price: 17.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Casual Blazer",
      description: "Modern blazer that blends comfort with elegance.",
      price: 42.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Travel Organizer",
      description: "Keep your travel essentials organized and secure.",
      price: 10.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Portable SSD",
      description: "Fast and reliable storage solution for your files.",
      price: 89.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Trekking Shoes",
      description: "Designed for trekking adventures and outdoor use.",
      price: 58.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Cotton Shorts",
      description: "Lightweight shorts ideal for hot weather.",
      price: 13.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Crossbody Bag",
      description: "Compact bag offering convenience and style.",
      price: 18.99,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Wireless Charger",
      description: "Fast wireless charging pad for compatible devices.",
      price: 21.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Skate Shoes",
      description: "Durable shoes designed for skating enthusiasts.",
      price: 36.99,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Zip Hoodie",
      description: "Versatile zip-up hoodie suitable for all seasons.",
      price: 27.99,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Passport Holder",
      description: "Protect your passport with this stylish holder.",
      price: 8.49,
      category: "Accessories",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Power Bank",
      description: "High-capacity portable charger for devices on the go.",
      price: 25.99,
      category: "Electronics",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Slip-On Shoes",
      description: "Easy-to-wear shoes with a sleek modern design.",
      price: 22.49,
      category: "Footwear",
      image: "https://picsum.photos/500/300",
    },
    {
      title: "Linen Shirt",
      description: "Breathable linen shirt perfect for warm weather.",
      price: 19.49,
      category: "Clothing",
      image: "https://picsum.photos/500/300",
    },
  ]);

  const insertedProducts = await Product.find();

  await Promise.all(
    insertedProducts.map((product, index) =>
      Product.findByIdAndUpdate(product._id, {
        image: `https://picsum.photos/500/300?random=${Date.now() + index}`,
      }),
    ),
  );

  return Response.json({
    message: "Database seeded successfully",
  });
}

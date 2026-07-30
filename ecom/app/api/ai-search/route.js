import OpenAI from "openai";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const clint = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function post(request) {
  const { query } = await request.json();
  const aiRes = await clint.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        {role: "user", content: "Convert this into a short product keyword" + query},
    ],  
    });
    const keyword = aiRes.choices[0].message.content.trim();
  await connectDB();
  const products = await Product.find({
    title: {
      $regex: query,
      $options: "i",
    }
  });
  return Response.json(products);
}

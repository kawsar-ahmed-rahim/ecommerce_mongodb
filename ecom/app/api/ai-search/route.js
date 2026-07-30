import OpenAI from "openai";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

function normalizeQuery(query) {
  return String(query || "")
    .trim()
    .toLowerCase();
}

function getSearchTerms(rawQuery) {
  const cleaned = normalizeQuery(rawQuery);
  if (!cleaned) return [];

  const words = cleaned.match(/[a-z0-9]+/g) || [];
  return [...new Set(words.filter((word) => word.length > 2))].slice(0, 6);
}

async function getAiKeywords(rawQuery) {
  const fallbackTerms = getSearchTerms(rawQuery);
  if (!fallbackTerms.length) return [];
  if (!process.env.OPENAI_KEY) return fallbackTerms;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract 3 to 6 short product-search keywords from the user query. Return only the keywords separated by spaces.",
        },
        { role: "user", content: rawQuery },
      ],
      temperature: 0.2,
    });

    const text = completion.choices?.[0]?.message?.content?.trim() || "";
    const aiTerms = text
      .split(/\s+/)
      .map((term) => term.toLowerCase().replace(/[^a-z0-9]+/g, ""))
      .filter(Boolean);

    return aiTerms.length ? aiTerms : fallbackTerms;
  } catch (error) {
    console.error("AI keyword extraction failed:", error);
    return fallbackTerms;
  }
}

export async function POST(request) {
  try {
    const { query = "" } = await request.json();
    const searchTerms = await getAiKeywords(query);

    await connectDB();

    if (!searchTerms.length) {
      const products = await Product.find().limit(20).lean();
      return Response.json(products);
    }

    const regexQueries = searchTerms.map((term) => ({
      $or: [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { category: { $regex: term, $options: "i" } },
      ],
    }));

    const products = await Product.find({ $and: regexQueries })
      .limit(20)
      .lean();

    const scoredProducts = products
      .map((product) => {
        const haystack = [product.title, product.description, product.category]
          .join(" ")
          .toLowerCase();

        let score = 0;

        searchTerms.forEach((term) => {
          if (haystack.includes(term)) score += 2;
        });

        if (haystack.includes(normalizeQuery(query))) score += 3;

        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);

    return Response.json(scoredProducts);
  } catch (error) {
    console.error("AI search failed:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}

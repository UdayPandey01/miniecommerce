import { Hono } from "hono";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = new Hono();

app.post("/product-upload", async (c) => {
  try {
    const data = await c.req.formData();

    const productName = data.get("productName") as string | null;
    const price = parseFloat(data.get("price") as string);
    const description = data.get("description") as string | null;
    const imageFile = data.get("image") as File | null;
    const userId = data.get("userId") as string | null;

    if (!productName || !description || isNaN(price)) {
      return c.json({ message: "Missing required fields" }, 400);
    }

    if (!imageFile) {
      return c.json({ message: "Image is required" }, 400);
    }

    if (!userId) {
      return c.json({ message: "User ID is required" }, 400);
    }

    const bytes = await imageFile.arrayBuffer();
    const base64String = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64String}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "products",
    });

    const newProduct = await prisma.product.create({
      data: {
        productName: productName,
        price: new Prisma.Decimal(price),
        description: description,
        image: uploadResult.secure_url,
        userId: userId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    return c.json(
      { message: "Product uploaded successfully!", product: newProduct },
      201
    );
  } catch (error) {
    console.error("Error uploading product:", error);
    return c.json({ message: "Server error", error }, 500);
  }
});

app.get("/get-products", async (c) => {
  try {
    const url = new URL(c.req.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const page = parseInt(url.searchParams.get("page") || "1");
    const userId = url.searchParams.get("userId");

    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (userId) {
      query.where = {
        userId: userId,
      };
    }

    // Add pagination
    query.take = limit;
    query.skip = skip;

    // Sort by newest first
    query.orderBy = {
      createdAt: "desc",
    };

    // Execute the query
    const products = await prisma.product.findMany(query);

    // Get total count for pagination
    const totalCount = await prisma.product.count({
      where: query.where,
    });

    return c.json(
      {
        products,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit),
        },
      },
      200
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json(
      {
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.get("/get-product/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return c.json({ message: "Product not found" }, 404);
    }

    return c.json({ product }, 200);
  } catch (error) {
    console.error("Error fetching product:", error);
    return c.json(
      {
        message: "Failed to fetch product",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.post("/gemini-search", async (c) => {
    try {
      const { query } = await c.req.json<{ query: string }>();
      if (!query) return c.json({ message: "Query is required" }, 400);
  
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Given the query: "${query}", generate keywords or product attributes to search for products across various categories.`;
  
      console.log('Prompt:', prompt);
  
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      console.log('Gemini Response:', response);
  
      const keywords = response.split(",").map((k) => k.trim());
  
      const products = await prisma.product.findMany({
        where: {
          OR: keywords.map((keyword) => ({
            OR: [
              { productName: { contains: keyword, mode: "insensitive" } },
              { description: { contains: keyword, mode: "insensitive" } },
            ],
          })),
        },
      });
  
      return c.json({ products });
    } catch (error) {
      console.error("Gemini search error:", error);
      return c.json({ message: "Error using Gemini", error: String(error) }, 500);
    }
  });
  

export default app;

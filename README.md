# 🛍️ MiniEcom – E-commerce Product Upload & Search Platform

**MiniEcom** is a full-stack mini e-commerce platform where users can sign up, log in, upload products with images, view all uploaded products, and search for products using an AI-powered smart search powered by Google Gemini.

---

## 🔧 Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Hono.js, Prisma ORM, PostgreSQL
- **Authentication**: JWT
- **Image Uploads**: Cloudinary
- **AI Search**: Google Gemini API

---

## ✅ What's Working

- 🔐 **User Authentication**
  - Sign-up with full name, email, and password
  - Secure login with JWT token generation

- 📦 **Product Management**
  - Upload products with image, name, description, and price
  - Images are uploaded to Cloudinary

- 🧾 **Product Listing**
  - Paginated fetching of all products
  - View individual product details

- 🤖 **Gemini AI Search**
  - Smart product search based on keyword expansion using Gemini API

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/udaypandey01/miniecommerce.git
cd miniecommerce

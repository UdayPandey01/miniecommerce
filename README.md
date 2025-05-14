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
```

### 2. Install the Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
# Cloudinary Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Database URL
DATABASE_URL=your_postgres_database_url
```

### 4. Generate the Prisma Client

```bash
npx prisma generate
```

### 5. Run the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---


## 👨‍💻 Author

- **Uday Pandey** - [GitHub Profile](https://github.com/udaypandey01)

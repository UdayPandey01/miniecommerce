"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar"

interface FormData {
  productName: string;
  price: string;
  description: string;
  image: File | null;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

const ProductSubmission = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    price: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setNotification({
          type: "error",
          message: "Image too large. Maximum size is 10MB.",
        });
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setNotification({
          type: "error",
          message:
            "Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("User not logged in. Please login first.");
      }

      const productData = new FormData();
      productData.append("productName", formData.productName);
      productData.append("price", formData.price);
      productData.append("description", formData.description);
      productData.append("userId", userId);
      
      if (formData.image) {
        productData.append("image", formData.image);
      }

      const res = await fetch("/api/product/product-upload", {
        method: "POST",
        body: productData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to upload product");
      }

      setFormData({
        productName: "",
        price: "",
        description: "",
        image: null,
      });
      setImagePreview(null);

      setNotification({
        type: "success",
        message: result.message || "Product uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading product:", error);
      setNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to upload product. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg shadow-md p-4 flex items-center ${
            notification.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <p>{notification.message}</p>
          <button
            onClick={() => setNotification(null)}
            className="ml-3 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="max-w-4xl mx-auto pt-10 pb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Add New Product
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pb-12 px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                
                {imagePreview ? (
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="aspect-square rounded-lg overflow-hidden bg-white">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                    >
                      <X size={18} className="text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer block"
                    >
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          Click to upload product image
                        </p>
                        <p className="text-xs text-gray-400">
                          JPG, PNG, GIF, WebP up to 10MB
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  id="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="block w-full pl-7 pr-12 border border-gray-300 rounded-md py-2 text-black"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Describe your product"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 ${
                    isUploading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  }`}
                >
                  {isUploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <span>Create Product</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductSubmission;
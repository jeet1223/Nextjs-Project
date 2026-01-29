"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/users/cms?type=about`);
        const data = await res.json();
        console.log(data,"kkkkk")
        if (data.data.length > 0) {
          setContent(data.data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // If data is still loading, show loading message
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  // Render the fetched HTML content (dangerouslySetInnerHTML to render HTML)
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-gray-950 dark:via-indigo-950 dark:to-blue-950 text-white py-32"
        style={{
          backgroundImage: "url('/about.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
        <motion.div 
          className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="space-y-6 animate-fade-in"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              About New Krishna Ceramics
            </h1>
            <p className="text-lg md:text-xl text-gray-200 dark:text-gray-300 leading-relaxed">
              "We are committed to delivering high-quality ceramic products with an exceptional shopping experience."
            </p>
            <motion.div 
              className="flex gap-4 pt-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                variants={itemVariants}
              >
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-gray-300">Products</div>
              </motion.div>
              <motion.div 
                className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                variants={itemVariants}
              >
                <div className="text-3xl font-bold">10k+</div>
                <div className="text-sm text-gray-300">Customers</div>
              </motion.div>
              <motion.div 
                className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                variants={itemVariants}
              >
                <div className="text-3xl font-bold">4.8★</div>
                <div className="text-sm text-gray-300">Rating</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <motion.div 
          className="max-w-5xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            Our Story
          </h2>
          <div 
            className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: content?.html || "<p class='text-center text-gray-500 dark:text-gray-400'>No content available.</p>" }} 
          />
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 text-white text-center">
        <motion.div 
          className="max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thousands of Happy Customers</h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100 dark:text-blue-200">Shop premium ceramic products with a brand you can trust.</p>
          <Link 
            href="/product"
            className="inline-block bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Shopping
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

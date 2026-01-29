// @ts-nocheck
'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="md:grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="inline-block"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <span className="bg-yellow-400 dark:bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                  New Arrival
                </span>
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-6xl font-extrabold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                New <span className="text-yellow-400 dark:text-yellow-300">Krishna</span> Ceramics
                <br />
                <span className="block text-yellow-400 dark:text-yellow-300">Premium Quality</span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-100 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Discover premium ceramic products at unbeatable prices. Quality guaranteed.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Link
                  href="/product"
                  className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-4 rounded-lg font-semibold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Shop Now →
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-white dark:border-gray-300 text-white dark:text-gray-200 hover:bg-white hover:text-blue-600 dark:hover:bg-gray-300 dark:hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-center transform hover:-translate-y-1 transition-all duration-200"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl blur-2xl opacity-30"></div>
                <div className="relative bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <motion.div 
                    className="grid grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div 
                      className="bg-white/20 dark:bg-white/10 rounded-lg p-6 text-center"
                      variants={itemVariants}
                    >
                      <div className="text-3xl font-bold">500+</div>
                      <div className="text-sm text-gray-200">Products</div>
                    </motion.div>
                    <motion.div 
                      className="bg-white/20 dark:bg-white/10 rounded-lg p-6 text-center"
                      variants={itemVariants}
                    >
                      <div className="text-3xl font-bold">10k+</div>
                      <div className="text-sm text-gray-200">Customers</div>
                    </motion.div>
                    <motion.div 
                      className="bg-white/20 dark:bg-white/10 rounded-lg p-6 text-center"
                      variants={itemVariants}
                    >
                      <div className="text-3xl font-bold">4.8</div>
                      <div className="text-sm text-gray-200">Rating</div>
                    </motion.div>
                    <motion.div 
                      className="bg-white/20 dark:bg-white/10 rounded-lg p-6 text-center"
                      variants={itemVariants}
                    >
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-sm text-gray-200">Support</div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-200"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">On all orders over $50</p>
            </motion.div>
            <motion.div 
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-200"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600 dark:text-gray-400">100% authentic products</p>
            </motion.div>
            <motion.div 
              className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-200"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-400">Always here to help you</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Check out our best selling ceramic products and latest arrivals
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[1, 2, 3, 4].map((item) => (
              <motion.div 
                key={item}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square relative bg-gray-200 dark:bg-gray-700">
                  <Image 
                    src={`/p${item}.jpg`} 
                    alt={`Product ${item}`} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Product {item}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Premium quality</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">$99.99</span>
                    <button className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-sm font-medium">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white">
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start shopping?</h2>
          <p className="text-lg md:text-xl mb-8 text-gray-100 dark:text-gray-300">
            Browse our full collection of premium ceramic products today
          </p>
          <Link
            href="/product"
            className="inline-block bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:-translate-y-1 transition-all duration-200 shadow-xl"
          >
            Explore Store →
          </Link>
        </motion.div>
      </section>

    </main>
  );
}

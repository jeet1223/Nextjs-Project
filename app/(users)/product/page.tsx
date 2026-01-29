'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../context/AuthContext';
import { useCart } from '../../../context/cartContext';
import { fetchAllProducts } from '@/app/services/apiService';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
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

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  categoryId: number;
  slug: string;
  stock: boolean;
  limitedItem: number;
  quantityName: string;
  tag: string;
  color: string;
  created_at: string;
  categoryName: string;
  images: string[];
  image?: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
  items: Product[];
}


export default function ShopPage() {
  const { isLoggedIn } = useContext(AuthContext);
  const { addToCart, removeFromCart, cart } = useCart();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep track of image index per product
  const [imageIndexes, setImageIndexes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchAllProducts();
        setCategories(res.data);

        // Initialize image indexes
        const initialIndexes: { [key: number]: number } = {};
        res.data.forEach((cat: Category) => {
          cat.items.forEach((prod: Product) => {
            initialIndexes[prod.id] = 0;
          });
        });
        setImageIndexes(initialIndexes);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      </div>
    );
  }

  const goToProduct = (productId: number) => {
     if (isLoggedIn) {
       router.push(`/product/${productId}`);
    } else {
      router.push(`/login?redirect=/product/${productId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">New Krishna Ceramics</h1>
        <p className="text-gray-600 dark:text-gray-400">Premium ceramic products collection</p>
      </motion.div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No products available at the moment</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category: Category) => (
            <div key={category.categoryId} className="mb-12">
              {/* Category Header */}
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {category.categoryName}
                </h2>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {category.items.length} items
                </span>
              </motion.div>

              {/* Products Grid */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {category.items.map((product: Product) => {
                  const currentIndex = imageIndexes[product.id] || 0;

                  return (
                    <motion.div
                      key={product.id}
                      onClick={() => goToProduct(product.id)}
                      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <img
                          src={
                            product.images?.[currentIndex] ||
                            product.image ||
                            '/placeholder.svg'
                          }
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                              View Details
                            </div>
                          </div>
                        </div>
                        {/* Badge */}
                        {product.limitedItem > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            Limited
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price and Action */}
                        <div className="flex items-center justify-between pt-2">
                          <div>
                            {product.discountPrice > 0 ? (
                              <div>
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                  ${product.discountPrice}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                                  ${product.price}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                ${product.price}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goToProduct(product.id);
                            }}
                            className="bg-blue-600 dark:bg-blue-700 text-white p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
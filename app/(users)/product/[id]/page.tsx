'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { fetchbyIdProducts } from "@/app/services/apiService";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useRouter } from 'next/navigation';
import ItemTabs from "./ItemTabs";

type Item = {
  id: number;
  name: string;
  categoryName: string;
  price: number;
  description: string;
  images: string[];
  category: string;
};

export default function ItemPage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;
  const { addToCart, removeFromCart, cart } = useCart();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1); // Quantity state
  const router = useRouter(); // Use useRouter for navigation

  useEffect(() => {
    if (!id) {
      // Use a timeout to avoid calling setState directly in the effect
      setTimeout(() => {
        setError("Invalid item ID");
        setLoading(false);
      }, 0);
      return;
    }

    fetchbyIdProducts(id)
      .then(setItem)
      .catch((err) => {
        // Use a timeout to avoid calling setState directly in the effect
        setTimeout(() => {
          setError(err.message);
        }, 0);
      })
      .finally(() => {
        // Use a timeout to avoid calling setState directly in the effect
        setTimeout(() => {
          setLoading(false);
        }, 0);
      });
  }, [id]);

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-20">{error}</p>;
  if (!item) return <p className="text-center py-20">Item not found</p>;

  const imageUrl = `http://localhost:3000${item.images?.[currentImage] || '/placeholder.svg'}`;

  // Cart handlers
  const handleAdd = () => {
    addToCart(item, quantity); // Pass quantity along with the item
    router.push('/cart'); // Redirect to the cart page after adding the item
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  // Check if the item is already in the cart
  const cartItem = cart.find((cartProduct) => cartProduct.id === item.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* IMAGE SECTION */}
        <div className="flex flex-col items-center">
          {/* MAIN IMAGE WITH ZOOM */}
          <div className="w-full h-[420px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
            <Zoom zoomMargin={40}>
              <img
                src={imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </Zoom>
          </div>

          {/* THUMBNAILS */}
          {item.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {item.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden border
                    ${currentImage === index ? "border-green-600" : "border-gray-300"}
                  `}
                >
                  <img
                    src={`http://localhost:3000${img}`}
                    alt={`${item.name}-${index}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAILS SECTION */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Product Name */}
            <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
            {/* Product Category */}
            <p className="text-sm text-gray-500 mb-4">{item.categoryName}</p>
            {/* Price */}
            <p className="text-3xl font-semibold text-green-600 mb-4">${item.price}</p>
            {/* Delivery and Stock Info */}
            <div className="text-gray-600 mb-6">
              <p>FREE delivery by Thursday, 8 January on orders over ₹499.</p>
              <p>Or fastest delivery Tomorrow, 7 January. Order within 1 hr 6 mins.</p>
              <p className="font-semibold text-green-600">In stock</p>
            </div>
            {/* Quantity Selector */}
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-2">Quantity:</label>
              <select
                id="quantity"
                className="border rounded px-3 py-2"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((qty) => (
                  <option key={qty} value={qty}>{qty}</option>
                ))}
              </select>
            </div>
            {/* Cart Buttons */}
            { (
              <div className="flex flex-col">
                <button
                  className="bg-yellow-500 text-white px-6 py-2 rounded-md mb-2 hover:bg-yellow-600 transition"
                  onClick={handleAdd}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Buy Now
                </button>
              </div>
            )}
            <div className="flex mt-4">
              <label htmlFor="gift-options" className="mr-2">Add gift options</label>
              <input type="checkbox" id="gift-options" />
            </div>
            <div className="mt-4">
              <button className="text-blue-600">Add to Wish List</button>
            </div>
          </div>
        </div>
<div className="mt-14">
  <ItemTabs />
</div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';  // Import CSS for zoom styles

interface Product {
  name: string;
  image: string;
}

const ProductPage: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div>
      <h1>{product.name}</h1>
      <Zoom>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded"
        />
      </Zoom>
    </div>
  );
};

export default ProductPage;

import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { Product } from '../App'

interface ProductListProps {
  products: Product[]
  addToCart: (product: Product) => void
}

const ProductList: React.FC<ProductListProps> = ({ products, addToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">₹{product.price.toFixed(2)}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center justify-center w-full"
            >
              <ShoppingCart className="mr-2" size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductList
import React, { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

export interface Product {
  id: number
  name: string
  price: number
  image: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const updateCartItemQuantity = (id: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const toggleCart = () => setIsCartOpen(!isCartOpen)

  const openCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const closeCheckout = () => {
    setIsCheckoutOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vegetable Oil Emporium</h1>
          <button onClick={toggleCart} className="flex items-center">
            <ShoppingCart className="mr-2" />
            <span>Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <ProductList products={products} addToCart={addToCart} />
      </main>
      {isCartOpen && (
        <Cart
          items={cartItems}
          onClose={toggleCart}
          updateQuantity={updateCartItemQuantity}
          removeItem={removeFromCart}
          openCheckout={openCheckout}
        />
      )}
      {isCheckoutOpen && (
        <Checkout
          items={cartItems}
          onClose={closeCheckout}
        />
      )}
    </div>
  )
}

export default App
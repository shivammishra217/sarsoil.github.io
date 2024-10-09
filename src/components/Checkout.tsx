import React, { useState } from 'react'
import { X } from 'lucide-react'
import { CartItem } from '../App'

interface CheckoutProps {
  items: CartItem[]
  onClose: () => void
}

const Checkout: React.FC<CheckoutProps> = ({ items, onClose }) => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePayment = async (provider: 'Paytm' | 'Razorpay') => {
    setProcessing(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      })

      if (!response.ok) {
        throw new Error('Checkout failed')
      }

      const result = await response.json()
      alert(`${provider} payment initiated successfully! Total: ₹${result.total.toFixed(2)}`)
      onClose()
    } catch (error) {
      console.error('Error during checkout:', error)
      setError('An error occurred during checkout. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="font-bold mt-2">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="space-y-2">
          <button
            onClick={() => handlePayment('Paytm')}
            disabled={processing}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Pay with Paytm'}
          </button>
          <button
            onClick={() => handlePayment('Razorpay')}
            disabled={processing}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
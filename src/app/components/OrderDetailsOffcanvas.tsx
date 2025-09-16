// src/app/components/OrderDetailsOffcanvas.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes,
  faTruck,
  faCreditCard,
  faCalendarAlt,
  faClock,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons'

interface OrderDetailsOffcanvasProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    status: string;
    statusColor: string;
    date: string;
    total: number;
    items: Array<{
      name: string;
      price: number;
      originalPrice?: number;
      quantity: number;
      image: string;
    }>;
    delivery: {
      estimatedDate: string;
      timeWindow: string;
      method: string;
      address: string;
    };
    payment: {
      method: string;
      tax: number;
      shipping: number;
      total: number;
    };
  };
}

export default function OrderDetailsOffcanvas({ isOpen, onClose, order }: OrderDetailsOffcanvasProps) {
  const [isChangingDelivery, setIsChangingDelivery] = useState(false)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Offcanvas */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Order Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order #</p>
                  <p className="text-lg font-semibold text-gray-900">{order.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    order.statusColor === 'blue' ? 'bg-blue-500' : 
                    order.statusColor === 'green' ? 'bg-green-500' : 
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{order.status}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 bg-white rounded-md">
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTruck} className="text-blue-500" />
                  Delivery
                </h3>
                <button 
                  onClick={() => setIsChangingDelivery(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Change time
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Estimated delivery date:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.delivery.estimatedDate} / {order.delivery.timeWindow}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faClock} className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping method:</p>
                    <p className="text-sm font-medium text-gray-900">{order.delivery.method}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Shipping address:</p>
                    <p className="text-sm font-medium text-gray-900">{order.delivery.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faCreditCard} className="text-green-500" />
                Payment
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment method:</span>
                  <span className="text-sm font-medium text-gray-900">{order.payment.method}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax collected:</span>
                  <span className="text-sm font-medium text-gray-900">${order.payment.tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping:</span>
                  <span className="text-sm font-medium text-gray-900">${order.payment.shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-900">Estimated total:</span>
                  <span className="text-base font-semibold text-gray-900">${order.payment.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200">
              Track Order
            </button>
          </div>
        </div>
      </div>

      {/* Delivery Time Change Modal (simplified) */}
      {isChangingDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Change Delivery Time</h3>
              <button onClick={() => setIsChangingDelivery(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Select a new delivery time window:</p>
            {/* Time selection options would go here */}
            <div className="flex gap-3">
              <button 
                onClick={() => setIsChangingDelivery(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsChangingDelivery(false)}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
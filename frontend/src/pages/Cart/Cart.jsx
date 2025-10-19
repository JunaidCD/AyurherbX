import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Plus, Minus, Trash2, Heart, Star, 
  ArrowLeft, CreditCard, Truck, Shield, Gift,
  MapPin, Clock, CheckCircle, AlertCircle, Tag
} from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    try {
      setLoading(true);
      // Load cart items from localStorage
      const savedCart = JSON.parse(localStorage.getItem('ayurherb_cart') || '[]');
      
      // Add additional properties for display
      const enhancedCart = savedCart.map(item => ({
        ...item,
        description: getProductDescription(item.name),
        category: getProductCategory(item.name),
        rating: (4.2 + Math.random() * 0.8).toFixed(1),
        reviews: Math.floor(Math.random() * 200) + 50,
        benefits: getProductBenefits(item.name),
        seller: 'AyurHerb Premium'
      }));
      
      setCartItems(enhancedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductDescription = (name) => {
    const descriptions = {
      'Allovera': 'Premium quality organic Aloe Vera gel extract',
      'Ashwagandha': 'Premium quality organic ashwagandha root powder',
      'Turmeric': 'High curcumin content turmeric extract capsules',
      'Brahmi': 'Pure brahmi oil for hair and scalp nourishment',
      'Neem': 'Organic Neem leaf powder with natural properties',
      'Tulsi': 'Sacred Tulsi leaves, dried and powdered'
    };
    return descriptions[name] || 'Premium quality ayurvedic herb product';
  };

  const getProductCategory = (name) => {
    const categories = {
      'Allovera': 'Gel Extract',
      'Ashwagandha': 'Powders',
      'Turmeric': 'Capsules',
      'Brahmi': 'Oils',
      'Neem': 'Powders',
      'Tulsi': 'Powders'
    };
    return categories[name] || 'Herbs';
  };

  const getProductBenefits = (name) => {
    const benefits = {
      'Allovera': ['Skin Healing', 'Moisturizing', 'Anti-inflammatory'],
      'Ashwagandha': ['Stress Relief', 'Energy Boost', 'Immunity'],
      'Turmeric': ['Anti-inflammatory', 'Joint Health', 'Antioxidant'],
      'Brahmi': ['Hair Growth', 'Memory Enhancement', 'Scalp Health'],
      'Neem': ['Antibacterial', 'Skin Health', 'Blood Purification'],
      'Tulsi': ['Respiratory Health', 'Immune Boost', 'Stress Relief']
    };
    return benefits[name] || ['Natural Healing', 'Health Support'];
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    
    // Update localStorage
    const cartForStorage = updatedItems.map(({ description, category, rating, reviews, benefits, seller, ...item }) => item);
    localStorage.setItem('ayurherb_cart', JSON.stringify(cartForStorage));
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    
    // Update localStorage
    const cartForStorage = updatedItems.map(({ description, category, rating, reviews, benefits, seller, ...item }) => item);
    localStorage.setItem('ayurherb_cart', JSON.stringify(cartForStorage));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'ayur10') {
      setPromoApplied(true);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-slate-700 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-slate-700 rounded-xl"></div>
                ))}
              </div>
              <div className="h-96 bg-slate-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm mx-auto">
                <ShoppingCart className="w-12 h-12 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-gray-400 text-lg mb-8">Discover our premium ayurvedic products and start your wellness journey</p>
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all duration-200">
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </button>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-gray-400 mt-1">{cartItems.length} items in your cart</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
              <div key={item.id} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center text-4xl border border-emerald-500/30">
                        {item.image}
                      </div>
                      {item.originalPrice > item.price && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                          <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-gray-300">{item.rating}</span>
                              <span className="text-gray-500">({item.reviews})</span>
                            </div>
                            <span className="text-emerald-400 font-medium">{item.seller}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Benefits */}
                      <div className="flex flex-wrap gap-2">
                        {item.benefits.map((benefit, idx) => (
                          <span key={idx} className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30">
                            {benefit}
                          </span>
                        ))}
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
                            >
                              <Minus className="w-4 h-4 text-gray-300" />
                            </button>
                            <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
                            >
                              <Plus className="w-4 h-4 text-gray-300" />
                            </button>
                          </div>
                          <div className="text-sm text-gray-400">
                            {item.stockCount} left in stock
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {item.originalPrice > item.price && (
                              <span className="text-gray-500 line-through text-sm">₹{item.originalPrice}</span>
                            )}
                            <span className="text-2xl font-bold text-white">₹{item.price}</span>
                          </div>
                          <div className="text-emerald-400 text-sm font-medium">
                            Total: ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            
            {/* Order Summary */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Order Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>You saved</span>
                      <span>-₹{savings.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo discount (10%)</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-300">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-yellow-400" />
                  Promo Code
                </h4>
                
                {!promoApplied ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    />
                    <button 
                      onClick={applyPromoCode}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Promo code "AYUR10" applied!</span>
                  </div>
                )}
                
                <p className="text-gray-400 text-sm mt-2">Try: AYUR10 for 10% off</p>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25">
              Proceed to Checkout
            </button>

            {/* Delivery Info */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <Truck className="w-5 h-5" />
                    <span className="font-medium">Free delivery on orders above ₹500</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Delivery in 2-3 business days</span>
                  </div>
                  <div className="flex items-center gap-3 text-purple-400">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">100% authentic products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

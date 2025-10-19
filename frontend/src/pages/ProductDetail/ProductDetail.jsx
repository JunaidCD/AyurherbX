import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Star, Shield, MapPin, Calendar, User, 
  Activity, Thermometer, Clock, Beaker, ShoppingCart, CreditCard,
  Plus, Minus, QrCode, CheckCircle, AlertCircle, Eye, Database
} from 'lucide-react';

const ProductDetail = ({ user, showToast }) => {
  const { herbName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    loadProductData();
  }, [herbName]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      
      // Check if herb is verified by admin
      const verifications = JSON.parse(localStorage.getItem('ayurherb_verifications') || '{}');
      const herbVerified = Object.values(verifications).some(v => 
        v.herbName?.toLowerCase() === herbName?.toLowerCase() && v.verified
      );
      setIsVerified(herbVerified);

      if (!herbVerified) {
        showToast(`${herbName} is not yet verified by admin. Cannot purchase unverified products.`, 'warning');
        return;
      }

      // Get collections data
      const collections = JSON.parse(localStorage.getItem('ayurherb_collections') || '[]');
      const herbCollection = collections.find(c => 
        c.herbName?.toLowerCase() === herbName?.toLowerCase()
      );

      // Get processing steps
      const processingSteps = JSON.parse(localStorage.getItem('ayurherb_processing_steps') || '{}');
      const herbProcessing = Object.values(processingSteps).filter(p => 
        p.herbName?.toLowerCase() === herbName?.toLowerCase()
      );

      // Get lab test data
      const labTests = JSON.parse(localStorage.getItem('ayurherb_lab_tests') || '{}');
      const herbLabTests = Object.values(labTests).filter(t => 
        t.herbName?.toLowerCase() === herbName?.toLowerCase()
      );

      // Generate random price based on herb type
      const basePrices = {
        'allovera': 380,
        'ashwagandha': 450,
        'turmeric': 280,
        'brahmi': 420,
        'neem': 220,
        'tulsi': 350
      };
      const basePrice = basePrices[herbName?.toLowerCase()] || 300;
      const randomPrice = basePrice + Math.floor(Math.random() * 100) - 50;
      setPrice(randomPrice);

      // Create comprehensive product data
      const product = {
        name: herbName,
        image: getProductImage(herbName),
        price: randomPrice,
        originalPrice: randomPrice + 50,
        inStock: true,
        stockCount: Math.floor(Math.random() * 50) + 10,
        rating: (4.2 + Math.random() * 0.8).toFixed(1),
        reviews: Math.floor(Math.random() * 200) + 50,
        description: getProductDescription(herbName),
        benefits: getProductBenefits(herbName),
        collection: herbCollection,
        processing: herbProcessing,
        labTests: herbLabTests,
        verification: verifications[Object.keys(verifications).find(key => 
          verifications[key].herbName?.toLowerCase() === herbName?.toLowerCase()
        )],
        batchId: herbCollection?.batchId || `BAT-${Date.now()}`,
        collectorId: herbCollection?.collectorAddress || 'COL-001',
        location: herbCollection?.location || '21.0397°N, 88.4400°E',
        harvestDate: herbCollection?.submissionDate || new Date().toISOString(),
        qualityGrade: 'Premium (A++)',
        moisture: '8.5%',
        purity: '99.2%'
      };

      setProductData(product);
    } catch (error) {
      console.error('Error loading product data:', error);
      showToast('Failed to load product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (herbName) => {
    const images = {
      'Allovera': '🌵',
      'Ashwagandha': '🌿',
      'Turmeric': '🟡',
      'Brahmi': '🍃',
      'Neem': '🌱',
      'Tulsi': '🌿'
    };
    return images[herbName] || '🌿';
  };

  const getProductDescription = (herbName) => {
    const descriptions = {
      'Allovera': 'Premium quality organic Aloe Vera gel extract, known for its healing and moisturizing properties. Sourced from certified organic farms.',
      'Ashwagandha': 'High-quality Ashwagandha root powder, traditionally used for stress relief and energy enhancement. Standardized extract with optimal potency.',
      'Turmeric': 'Pure turmeric powder with high curcumin content, perfect for anti-inflammatory benefits and culinary use.',
      'Brahmi': 'Brahmi herb extract known for cognitive enhancement and memory support. Carefully processed to retain active compounds.',
      'Neem': 'Organic Neem leaf powder with natural antibacterial and antifungal properties. Ideal for skincare and health applications.',
      'Tulsi': 'Sacred Tulsi leaves, dried and powdered for maximum potency. Known for immune support and respiratory health.'
    };
    return descriptions[herbName] || 'Premium quality ayurvedic herb with traditional medicinal properties.';
  };

  const getProductBenefits = (herbName) => {
    const benefits = {
      'Allovera': ['Skin Healing', 'Moisturizing', 'Anti-inflammatory', 'Digestive Health'],
      'Ashwagandha': ['Stress Relief', 'Energy Boost', 'Immunity', 'Sleep Quality'],
      'Turmeric': ['Anti-inflammatory', 'Joint Health', 'Antioxidant', 'Digestive Aid'],
      'Brahmi': ['Memory Enhancement', 'Cognitive Support', 'Stress Relief', 'Mental Clarity'],
      'Neem': ['Antibacterial', 'Skin Health', 'Blood Purification', 'Immune Support'],
      'Tulsi': ['Respiratory Health', 'Immune Boost', 'Stress Relief', 'Antioxidant']
    };
    return benefits[herbName] || ['Natural Healing', 'Health Support', 'Traditional Medicine'];
  };

  const generateQRCodeURL = (data) => {
    const qrText = `AYURHERB PRODUCT DETAILS

BATCH ID: ${data.collection?.batchId || data.batchId || 'N/A'}
COLLECTOR ID: ${data.collection?.collectorAddress || data.collectorId || 'N/A'}

PROCESSING STEPS:
${data.processing && data.processing.length > 0 ? 
  data.processing.map((step, idx) => 
    `${idx + 1}. ${step.stepType || 'Unknown Step'}
Temperature: ${step.temperature || 'N/A'}
Duration: ${step.duration || 'N/A'}
Date: ${step.timestamp ? new Date(step.timestamp).toLocaleDateString() : 'N/A'}`
  ).join('\n') : 
  'No processing steps recorded'
}

LAB TEST RESULTS:
${data.labTests && data.labTests.length > 0 ? 
  data.labTests.map((test, idx) => 
    `${idx + 1}. ${test.testType || 'Unknown Test'}
Result: ${test.result || 'N/A'}
Status: ${test.status || 'Pending'}
Date: ${test.timestamp ? new Date(test.timestamp).toLocaleDateString() : 'N/A'}`
  ).join('\n') : 
  'No lab tests recorded'
}`;

    const encodedData = encodeURIComponent(qrText);
    return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&ecc=M&data=${encodedData}`;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= productData.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: Date.now(),
      name: productData.name,
      price: productData.price,
      originalPrice: productData.originalPrice,
      quantity: quantity,
      image: productData.image,
      batchId: productData.batchId,
      inStock: true,
      stockCount: productData.stockCount
    };

    // Get existing cart or create new one
    const existingCart = JSON.parse(localStorage.getItem('ayurherb_cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(item => item.batchId === cartItem.batchId);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }

    localStorage.setItem('ayurherb_cart', JSON.stringify(existingCart));
    showToast(`${quantity} kg of ${productData.name} added to cart!`, 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-slate-700 rounded-xl w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-slate-700 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-700 rounded w-3/4"></div>
                <div className="h-6 bg-slate-700 rounded w-1/2"></div>
                <div className="h-32 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/view-product')}
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>

          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-600/20 border-2 border-red-500/30 rounded-3xl flex items-center justify-center backdrop-blur-sm mx-auto">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Product Not Verified</h2>
            <p className="text-gray-400 text-lg mb-8">
              {herbName} has not been verified by an admin yet. Only verified products can be purchased.
            </p>
            <button
              onClick={() => navigate('/view-product')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
            >
              Browse Verified Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/view-product')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/view-product')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Admin Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Image and QR Code */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <div className="text-center">
                  <div className="text-8xl mb-6">{productData.image}</div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent mb-2">
                    {productData.name}
                  </h1>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{productData.rating}</span>
                      <span className="text-gray-400">({productData.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  {/* QR Code Section */}
                  <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-400" />
                      Product QR Code
                    </h3>
                    <div className="bg-white p-4 rounded-xl mx-auto w-fit">
                      <img 
                        src={generateQRCodeURL(productData)} 
                        alt="Product QR Code"
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                    <p className="text-gray-400 text-sm mt-4">
                      Scan for complete traceability and verification details
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            
            {/* Pricing */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-500 line-through text-xl">₹{productData.originalPrice}</span>
                      <span className="text-3xl font-bold text-white">₹{productData.price}</span>
                      <span className="text-sm font-medium text-white bg-red-500 px-2 py-1 rounded-full">
                        {Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <p className="text-gray-400">per kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">In Stock</p>
                    <p className="text-gray-400 text-sm">{productData.stockCount} kg available</p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-white font-medium">Quantity:</span>
                  <div className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-1">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-slate-600/50 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4 text-gray-300" />
                    </button>
                    <span className="text-white font-semibold w-12 text-center">{quantity} kg</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= productData.stockCount}
                      className="p-2 hover:bg-slate-600/50 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                  <div className="text-emerald-400 font-bold">
                    Total: ₹{(productData.price * quantity).toLocaleString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
                  >
                    <CreditCard className="w-5 h-5" />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{productData.description}</p>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Benefits:</h4>
                  <div className="flex flex-wrap gap-2">
                    {productData.benefits.map((benefit, index) => (
                      <span key={index} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full border border-emerald-500/30">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Information */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur"></div>
              <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-yellow-400" />
                  Batch Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quality Grade:</span>
                      <span className="text-emerald-400 font-medium">{productData.qualityGrade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white font-medium">{productData.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Harvest Date:</span>
                      <span className="text-white font-medium">{new Date(productData.harvestDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Purity:</span>
                      <span className="text-emerald-400 font-medium">{productData.purity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Steps */}
            {productData.processing && productData.processing.length > 0 && (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-2xl blur"></div>
                <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Processing Steps ({productData.processing.length})
                  </h3>
                  <div className="space-y-3">
                    {productData.processing.map((step, index) => (
                      <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{step.stepType}</h4>
                          <span className="text-xs text-gray-400">{new Date(step.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-orange-400" />
                            <span className="text-gray-400">Temperature:</span>
                            <span className="text-white">{step.temperature || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white">{step.duration || 'N/A'}</span>
                          </div>
                        </div>
                        {step.notes && (
                          <p className="text-gray-300 text-sm mt-2">{step.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lab Tests */}
            {productData.labTests && productData.labTests.length > 0 && (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl blur"></div>
                <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-cyan-400" />
                    Lab Test Results ({productData.labTests.length})
                  </h3>
                  <div className="space-y-3">
                    {productData.labTests.map((test, index) => (
                      <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/30">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold">{test.testType}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            test.status === 'Passed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Result: <span className="text-white">{test.result}</span></span>
                          <span className="text-gray-400">{new Date(test.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

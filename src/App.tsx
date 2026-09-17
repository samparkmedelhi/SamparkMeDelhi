import React, { useState, useEffect } from 'react';
import { Product, Order } from './types';
import { INITIAL_PRODUCTS } from './config/businessConfig';

// Providers
import { RouterProvider, useRouter } from './context/RouterContext';
import { CartProvider, useCart } from './context/CartContext';

// Core Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { SharkTankSection } from './components/SharkTankSection';
import { VideoSection } from './components/VideoSection';
import { StatsSection } from './components/StatsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ProductDetailModal } from './components/ProductDetailModal';

// Order Confirmation Modal
import { OrderConfirmation } from './components/OrderConfirmation';

// Dedicated Pages
import { SharkTankPage } from './pages/SharkTankPage';
import { ContactPage } from './pages/ContactPage';
import { CartCheckoutPage } from './pages/CartCheckoutPage';
import { AdminPage } from './pages/AdminPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';

function MainApp() {
  const { currentPath, navigate } = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Selected Product Detail modal
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Confirmed Order state (for instant post-order modal if triggered)
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [whatsappAdminUrl, setWhatsappAdminUrl] = useState<string>('');

  // Fetch live products from backend API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(err => {
        console.warn("Using fallback local products list", err);
      });
  }, []);

  const handleQuickBuy = (product: Product) => {
    addToCart(product, 1);
    navigate('/cart');
  };

  const handleOpenOrderNow = () => {
    navigate('/shop');
  };

  // Dedicated Admin Route - Completely independent, protected, and private
  if (currentPath === '/admin') {
    return <AdminPage />;
  }

  // Shop routing resolution
  const isShopRoot = currentPath === '/shop' || currentPath === '/products';
  const isShopProduct = currentPath.startsWith('/shop/') || currentPath.startsWith('/product/');

  let activeProductForDetail: Product | null = null;
  if (isShopProduct) {
    const segments = currentPath.split('/').filter(Boolean);
    const targetId = segments[segments.length - 1];
    activeProductForDetail =
      products.find(p => p.id === targetId) ||
      INITIAL_PRODUCTS.find(p => p.id === targetId) ||
      products[0] ||
      INITIAL_PRODUCTS[0];
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900 flex flex-col font-sans selection:bg-[#FFE600] selection:text-black">
      
      {/* Primary Navigation - Top black bar completely removed */}
      <Navbar onOpenOrderModal={handleOpenOrderNow} />

      {/* Main Multi-Page Body */}
      <main className="flex-1">
        {/* Route: Home ('/' or '' or '/home') */}
        {(currentPath === '/' || currentPath === '' || currentPath === '/home') && (
          <>
            {/* Hero Section */}
            <Hero
              onOpenOrderModal={handleOpenOrderNow}
              onExploreProducts={() => {
                const el = document.getElementById('shop-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/shop');
              }}
            />

            {/* Shop Section directly embedded on Home page */}
            <section id="shop-section" className="border-t border-neutral-200/80 scroll-mt-20">
              <ShopPage
                products={products}
                onSelectProduct={(p) => navigate(`/shop/${p.id}`)}
                hideBottomStrip={true}
              />
            </section>

            {/* How It Works - 3 Step Flow */}
            <HowItWorks />

            {/* Shark Tank Season 5 Feature with Direct Embedded Player */}
            <SharkTankSection onOpenOrderModal={handleOpenOrderNow} />

            {/* Video Section */}
            <VideoSection />

            {/* High Impact Yellow Banner (950000+ dark stat block removed) */}
            <StatsSection onOpenOrderModal={handleOpenOrderNow} />

            {/* Customer Reviews & Genuine Feedback */}
            <ReviewsSection />

            {/* Official Delhi Location & Hub (Narela, Delhi 110040) */}
            <LocationSection />
          </>
        )}

        {/* Route: Dedicated Shop Page (/shop) */}
        {isShopRoot && (
          <ShopPage
            products={products}
            onSelectProduct={(p) => navigate(`/shop/${p.id}`)}
          />
        )}

        {/* Route: Dedicated Product Detail Page (/shop/:productId or /product/:productId) */}
        {isShopProduct && activeProductForDetail && (
          <ProductDetailPage
            product={activeProductForDetail}
            onBackToShop={() => navigate('/shop')}
            onQuickOrder={handleQuickBuy}
          />
        )}

        {/* Route: Dedicated Shark Tank Page */}
        {currentPath === '/shark-tank' && (
          <SharkTankPage products={products} />
        )}

        {/* Route: Dedicated Contact Hub Page */}
        {currentPath === '/contact' && (
          <ContactPage />
        )}

        {/* Route: Dedicated Cart & Multi-Item Checkout Page */}
        {(currentPath === '/cart' || currentPath === '/checkout') && (
          <CartCheckoutPage
            onOrderSuccess={(order, waUrl) => {
              setConfirmedOrder(order);
              setWhatsappAdminUrl(waUrl);
            }}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onOpenOrderModal={handleOpenOrderNow} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        isOpen={!!selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onOrderNow={(p) => {
          setSelectedProductDetail(null);
          handleQuickBuy(p);
        }}
      />

      {/* Order Confirmation Modal (if checkout succeeds) */}
      {confirmedOrder && (
        <OrderConfirmation
          isOpen={!!confirmedOrder}
          order={confirmedOrder}
          whatsappAdminUrl={whatsappAdminUrl}
          onClose={() => {
            setConfirmedOrder(null);
            navigate('/');
          }}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </RouterProvider>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PreOrder from "./pages/PreOrder";
import OrderSuccess from "./pages/OrderSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import Dashboard from "./pages/Dashboard";
import OrderStatus from "./pages/OrderStatus";
import FarmerDetail from "./pages/FarmerDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerOrders from "./pages/FarmerOrders";
import FarmerProducts from "./pages/FarmerProducts";
import FarmerProfile from "./pages/FarmerProfile";
import FarmerSettings from "./pages/FarmerSettings";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Force reload after fixing syntax error v2
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute allowRole="customer">
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute allowRole="customer">
                  <ProductDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowRole="customer">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowRole="customer">
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pre-order"
              element={
                <ProtectedRoute allowRole="customer">
                  <PreOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success"
              element={
                <ProtectedRoute allowRole="customer">
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowRole="customer">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-status/:orderId"
              element={
                <ProtectedRoute allowRole="customer">
                  <OrderStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/:id"
              element={
                <ProtectedRoute allowRole="customer">
                  <FarmerDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute allowRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/orders"
              element={
                <ProtectedRoute allowRole="farmer">
                  <FarmerOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/products"
              element={
                <ProtectedRoute allowRole="farmer">
                  <FarmerProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/profile"
              element={
                <ProtectedRoute allowRole="farmer">
                  <FarmerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/settings"
              element={
                <ProtectedRoute allowRole="farmer">
                  <FarmerSettings />
                </ProtectedRoute>
              }
            />
          </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Concierge } from './pages/Concierge';
import { Pricing } from './pages/Pricing';
import { Login } from './pages/Login';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/useAuthStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="concierge" element={<Concierge />} />
          <Route path="pricing" element={<Pricing />} />
          {/* Placeholders for other routes */}
          <Route path="bookings" element={<div className="p-12 text-center text-sage/40">Bookings Module Initialising...</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

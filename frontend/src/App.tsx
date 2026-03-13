import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import { useAuthStore } from './store/authStore'

import HomePage from './modules/medicines/pages/HomePage'
import MedicineListPage from './modules/medicines/pages/MedicineListPage'
import MedicineDetailPage from './modules/medicines/pages/MedicineDetailPage'
import CartPage from './modules/cart/pages/CartPage'
import CheckoutPage from './modules/orders/pages/CheckoutPage'
import OrderHistoryPage from './modules/orders/pages/OrderHistoryPage'
import OrderDetailPage from './modules/orders/pages/OrderDetailPage'
import LoginPage from './modules/auth/pages/LoginPage'
import RegisterPage from './modules/auth/pages/RegisterPage'
import ProfilePage from './modules/auth/pages/ProfilePage'
import PrescriptionPage from './modules/prescriptions/pages/PrescriptionPage'
import StorePage from './modules/store/pages/StorePage'
import AdminDashboard from './modules/admin/pages/AdminDashboard'
import AdminMedicines from './modules/admin/pages/AdminMedicinesPage'
import AdminOrders from './modules/admin/pages/AdminOrdersPage'
import AdminPrescriptions from './modules/admin/pages/AdminPrescriptions'
import AdminAnalytics from './modules/analytics/pages/AdminAnalytics'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/medicines" element={<MedicineListPage />} />
        <Route path="/medicines/:id" element={<MedicineDetailPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Route>
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="medicines" element={<AdminMedicines />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="prescriptions" element={<AdminPrescriptions />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

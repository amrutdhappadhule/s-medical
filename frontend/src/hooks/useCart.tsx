import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useCart = () => {
  const { isAuthenticated } = useAuthStore()
  const { items, totalItems: itemCount, totalAmount, addItem, updateItem, removeItem, clearCart: clearCartLocal, setCart } = useCartStore()

  const addToCart = async (medicine: any, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    try {
      const data: any = await api.post('/cart/add', { medicineId: medicine._id, quantity })
      if (data?.items) setCart(data.items)
      else addItem(medicine, quantity)
      toast.success(`${medicine.name} added to cart`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart')
    }
  }

  const removeFromCart = async (medicineId: string) => {
    try {
      const data: any = await api.delete(`/cart/remove/${medicineId}`)
      if (data?.items) setCart(data.items)
      else removeItem(medicineId)
      toast.success('Item removed from cart')
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove item')
    }
  }

  const updateQuantity = async (medicineId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(medicineId); return }
    try {
      const data: any = await api.put('/cart/update', { medicineId, quantity })
      if (data?.items) setCart(data.items)
      else updateItem(medicineId, quantity)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update quantity')
    }
  }

  const fetchCart = async () => {
    if (!isAuthenticated) return
    try {
      const data: any = await api.get('/cart')
      if (data?.items) setCart(data.items)
    } catch {}
  }

  return { items, itemCount, totalAmount, addToCart, removeFromCart, updateQuantity, clearCart: clearCartLocal, fetchCart, isLoading: false }
}

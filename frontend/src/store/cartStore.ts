import { create } from 'zustand'

interface CartItem {
  medicine: {
    _id: string
    name: string
    price: number
    imageUrl?: string
    stock: number
    prescriptionRequired: boolean
    manufacturer?: string
  }
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  setCart: (items: CartItem[]) => void
  addItem: (medicine: any, quantity?: number) => void
  updateItem: (medicineId: string, quantity: number) => void
  removeItem: (medicineId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalAmount: 0,

  setCart: (items) => {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalAmount = items.reduce((sum, i) => sum + i.medicine.price * i.quantity, 0)
    set({ items, totalItems, totalAmount })
  },

  addItem: (medicine, quantity = 1) => {
    const { items } = get()
    const existingIndex = items.findIndex((i) => i.medicine._id === medicine._id)
    let newItems

    if (existingIndex > -1) {
      newItems = items.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      newItems = [...items, { medicine, quantity }]
    }

    const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0)
    const totalAmount = newItems.reduce((sum, i) => sum + i.medicine.price * i.quantity, 0)
    set({ items: newItems, totalItems, totalAmount })
  },

  updateItem: (medicineId, quantity) => {
    const { items } = get()
    const newItems = quantity <= 0
      ? items.filter((i) => i.medicine._id !== medicineId)
      : items.map((i) => i.medicine._id === medicineId ? { ...i, quantity } : i)

    const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0)
    const totalAmount = newItems.reduce((sum, i) => sum + i.medicine.price * i.quantity, 0)
    set({ items: newItems, totalItems, totalAmount })
  },

  removeItem: (medicineId) => {
    const { items } = get()
    const newItems = items.filter((i) => i.medicine._id !== medicineId)
    const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0)
    const totalAmount = newItems.reduce((sum, i) => sum + i.medicine.price * i.quantity, 0)
    set({ items: newItems, totalItems, totalAmount })
  },

  clearCart: () => set({ items: [], totalItems: 0, totalAmount: 0 }),
}))

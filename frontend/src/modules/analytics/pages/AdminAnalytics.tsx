import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Grid, Typography, Paper, CircularProgress, Card, CardContent } from '@mui/material'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { TrendingUp, ShoppingBag, Medication, People } from '@mui/icons-material'
import api from '../../../services/api'

const COLORS = ['#1a9e5e', '#ff6b35', '#2196f3', '#9c27b0', '#f59e0b', '#e53935']

export default function AdminAnalytics() {
  const { data: stats } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => api.get('/analytics/dashboard'),
  })

  const { data: dailySales } = useQuery({
    queryKey: ['daily-sales'],
    queryFn: () => api.get('/analytics/daily-sales?days=14'),
  })

  const { data: topMedicines } = useQuery({
    queryKey: ['top-medicines'],
    queryFn: () => api.get('/analytics/top-medicines?limit=8'),
  })

  const { data: categoryStats } = useQuery({
    queryKey: ['category-stats'],
    queryFn: () => api.get('/analytics/category-stats'),
  })

  const s = stats as any
  const sales = (dailySales as any) || []
  const topMeds = (topMedicines as any) || []
  const catStats = (categoryStats as any) || []

  const statCards = [
    { label: 'Total Revenue', value: `₹${(s?.totalSales || 0).toLocaleString('en-IN')}`, icon: <TrendingUp />, color: '#1a9e5e', bg: '#e8f7f1' },
    { label: 'Total Orders', value: s?.totalOrders || 0, icon: <ShoppingBag />, color: '#ff6b35', bg: '#fff3ee' },
    { label: 'Medicines', value: s?.totalMedicines || 0, icon: <Medication />, color: '#2196f3', bg: '#e3f2fd' },
    { label: 'Customers', value: s?.totalCustomers || 0, icon: <People />, color: '#9c27b0', bg: '#f3e5f5' },
  ]

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Sales Analytics</Typography>

      <Grid container spacing={3} mb={4}>
        {statCards.map((card) => (
          <Grid item xs={6} md={3} key={card.label}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color={card.color}>{card.value}</Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>{card.label}</Typography>
                  </Box>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: card.bg, color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Daily Sales Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Daily Sales (Last 14 Days)</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={sales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v: any) => [`₹${v}`, 'Sales']} />
                <Line type="monotone" dataKey="totalSales" stroke="#1a9e5e" strokeWidth={2.5} dot={{ r: 4, fill: '#1a9e5e' }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Category Pie */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Sales by Category</Typography>
            {catStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={catStats} dataKey="totalRevenue" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {catStats.map((_: any, idx: number) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography color="text.secondary">No data yet</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Top Medicines */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Top Selling Medicines</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topMeds} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="totalSold" fill="#1a9e5e" radius={[0, 4, 4, 0]} name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

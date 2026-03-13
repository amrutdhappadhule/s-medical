import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../../services/api';

const StatCard = ({ title, value, icon, color, bgColor, subtitle, trend }: any) => (
  <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0', height: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 0.5 }}>{title}</Typography>
        <Typography sx={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color }}>{value}</Typography>
        {subtitle && <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>{subtitle}</Typography>}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <TrendingUpIcon sx={{ fontSize: 14, color: '#2E7D32' }} />
            <Typography sx={{ fontSize: 12, color: '#2E7D32', fontWeight: 600 }}>{trend}</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </Box>
    </Box>
  </Paper>
);

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard');
      return res as any;
    },
  });

  const { data: salesData } = useQuery({
    queryKey: ['sales-chart'],
    queryFn: async () => {
      const res = await api.get('/analytics/daily-sales');
      return res as any;
    },
  });

  const { data: topMedicines } = useQuery({
    queryKey: ['top-medicines'],
    queryFn: async () => {
      const res = await api.get('/analytics/top-medicines');
      return res as any;
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const res = await api.get('/orders?limit=5&sort=newest');
      return res as any;
    },
  });

  const { data: pendingPrescriptions } = useQuery({
    queryKey: ['pending-prescriptions'],
    queryFn: async () => {
      const res = await api.get('/prescriptions?status=pending&limit=5');
      return res as any;
    },
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  const statCards = [
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingCartIcon />, color: '#1565C0', bgColor: '#E3F2FD', trend: '+12% this month' },
    { title: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <TrendingUpIcon />, color: '#2E7D32', bgColor: '#E8F5E9', trend: '+8% this month' },
    { title: 'Total Medicines', value: stats?.totalMedicines || 0, icon: <MedicationIcon />, color: '#6A1B9A', bgColor: '#F3E5F5', subtitle: 'in catalog' },
    { title: 'Low Stock', value: stats?.lowStock || 0, icon: <WarningIcon />, color: '#E65100', bgColor: '#FBE9E7', subtitle: 'medicines need restocking' },
    { title: 'Pending Rx', value: stats?.pendingPrescriptions || 0, icon: <AssignmentIcon />, color: '#F57F17', bgColor: '#FFF8E1', subtitle: 'awaiting review' },
    { title: 'Total Customers', value: stats?.totalCustomers || 0, icon: <PeopleIcon />, color: '#00695C', bgColor: '#E0F2F1', trend: '+5 this week' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Sora', fontWeight: 800 }}>Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>Welcome back! Here's what's happening at Swami Medical.</Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={6} md={4} lg={2} key={card.title}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
            <Typography fontWeight={700} sx={{ mb: 3 }}>Sales Overview (Last 7 Days)</Typography>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salesData || MOCK_SALES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => [`₹${v}`, 'Revenue']} contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="#00856F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0', height: '100%' }}>
            <Typography fontWeight={700} sx={{ mb: 3 }}>Top Selling Medicines</Typography>
            {(topMedicines || MOCK_TOP).map((med: any, i: number) => (
              <Box key={med.name} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: '#F0FBF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'primary.main' }}>{i + 1}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{med.name}</Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{med.sold} sold</Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main' }}>₹{med.revenue}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ borderRadius: 3, border: '1px solid #E8ECF0' }}>
            <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8ECF0' }}>
              <Typography fontWeight={700}>Recent Orders</Typography>
              <Button component={Link} to="/admin/orders" size="small">View All</Button>
            </Box>
            {(recentOrders || []).length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary" sx={{ fontSize: 14 }}>No recent orders</Typography></Box>
            ) : (
              (recentOrders || []).slice(0, 5).map((order: any) => (
                <Box key={order._id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F7FA', '&:last-child': { borderBottom: 'none' } }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>#{order._id?.slice(-6).toUpperCase()}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{order.user?.name || 'Customer'}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>₹{order.totalAmount?.toFixed(2)}</Typography>
                    <Chip label={order.orderStatus} size="small" sx={{ fontSize: 10, height: 18, bgcolor: '#E3F2FD', color: '#1565C0' }} />
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ borderRadius: 3, border: '1px solid #E8ECF0' }}>
            <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E8ECF0' }}>
              <Typography fontWeight={700}>Pending Prescriptions</Typography>
              <Button component={Link} to="/admin/prescriptions" size="small">View All</Button>
            </Box>
            {(pendingPrescriptions || []).length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary" sx={{ fontSize: 14 }}>No pending prescriptions</Typography></Box>
            ) : (
              (pendingPrescriptions || []).slice(0, 5).map((p: any) => (
                <Box key={p._id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5F7FA', '&:last-child': { borderBottom: 'none' } }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Rx #{p._id?.slice(-6).toUpperCase()}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{p.user?.name || 'Customer'}</Typography>
                  </Box>
                  <Chip label="Pending" size="small" sx={{ bgcolor: '#FFF8E1', color: '#F57F17', fontWeight: 700, fontSize: 11 }} />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const MOCK_SALES = [
  { date: 'Mon', revenue: 2400 }, { date: 'Tue', revenue: 1800 }, { date: 'Wed', revenue: 3200 },
  { date: 'Thu', revenue: 2800 }, { date: 'Fri', revenue: 4100 }, { date: 'Sat', revenue: 3600 }, { date: 'Sun', revenue: 2900 },
];
const MOCK_TOP = [
  { name: 'Paracetamol 500mg', sold: 142, revenue: 1420 },
  { name: 'Vitamin C Tablets', sold: 98, revenue: 2940 },
  { name: 'BP Control 10mg', sold: 76, revenue: 3800 },
  { name: 'Cough Syrup 100ml', sold: 65, revenue: 1950 },
  { name: 'Insulin 100IU', sold: 54, revenue: 5400 },
];

export default AdminDashboard;

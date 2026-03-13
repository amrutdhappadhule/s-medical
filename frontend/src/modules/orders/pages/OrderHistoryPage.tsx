import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import { Order } from '../../../types';
import { format } from 'date-fns';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  placed: { label: 'Order Placed', color: '#1565C0', bg: '#E3F2FD' },
  preparing: { label: 'Preparing', color: '#F57F17', bg: '#FFF8E1' },
  ready: { label: 'Ready', color: '#6A1B9A', bg: '#F3E5F5' },
  delivered: { label: 'Delivered', color: '#2E7D32', bg: '#E8F5E9' },
  cancelled: { label: 'Cancelled', color: '#B71C1C', bg: '#FFEBEE' },
};

const OrderHistoryPage = () => {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await api.get('/orders/my-orders');
      return res as any;
    },
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>My Orders</Typography>

      {!orders || orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ReceiptIcon sx={{ fontSize: 80, color: '#E8ECF0', mb: 2 }} />
          <Typography variant="h6" fontWeight={700}>No orders yet</Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>Start shopping to see your orders here</Typography>
          <Button variant="contained" component={Link} to="/medicines">Shop Now</Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
            return (
              <Paper key={order._id} sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography fontWeight={700} sx={{ fontSize: 15 }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.3 }}>
                      {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
                    </Typography>
                  </Box>
                  <Chip label={status.label} sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: 12 }} />
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
                  {order.items?.slice(0, 3).map((item, i) => (
                    <Chip key={i} label={`${item.medicine?.name || 'Medicine'} × ${item.quantity}`}
                      size="small" variant="outlined" sx={{ fontSize: 12 }} />
                  ))}
                  {(order.items?.length || 0) > 3 && (
                    <Chip label={`+${order.items.length - 3} more`} size="small" sx={{ bgcolor: '#F5F7FA', fontSize: 12 }} />
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                      {order.deliveryType === 'home' ? '🚚 Home Delivery' : '🏪 Store Pickup'} •{' '}
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'store' ? 'Pay at Store' : 'Online Payment'}
                    </Typography>
                    <Typography fontWeight={800} color="primary" sx={{ fontSize: 18, mt: 0.3 }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </Typography>
                  </Box>
                  <Button variant="outlined" component={Link} to={`/orders/${order._id}`} size="small">
                    View Details
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default OrderHistoryPage;

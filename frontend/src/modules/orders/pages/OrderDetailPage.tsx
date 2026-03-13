import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import { Order } from '../../../types';
import { format } from 'date-fns';

const ORDER_STEPS = ['Order Placed', 'Preparing', 'Ready / Out for Delivery', 'Delivered'];
const STATUS_TO_STEP: Record<string, number> = { placed: 0, preparing: 1, ready: 2, delivered: 3 };

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res as any;
    },
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  if (!order) return <Container sx={{ py: 4 }}><Typography>Order not found.</Typography></Container>;

  const activeStep = STATUS_TO_STEP[order.orderStatus] ?? 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Order Details</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>#{order._id.slice(-8).toUpperCase()}</Typography>
        </Box>
        <Button variant="outlined" component={Link} to="/orders">← All Orders</Button>
      </Box>

      {/* Status tracker */}
      {order.orderStatus !== 'cancelled' ? (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
          <Typography fontWeight={700} sx={{ mb: 3 }}>Order Status</Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            {ORDER_STEPS.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: '#FFEBEE', border: '1px solid #FFCDD2' }}>
          <Typography fontWeight={700} color="error">Order Cancelled</Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Items */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ borderRadius: 3, border: '1px solid #E8ECF0', overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid #E8ECF0' }}>
              <Typography fontWeight={700}>Items Ordered</Typography>
            </Box>
            {order.items?.map((item, i) => (
              <Box key={i}>
                <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography fontWeight={600} sx={{ fontSize: 14 }}>{item.medicine?.name || 'Medicine'}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>₹{item.price.toFixed(2)} × {item.quantity}</Typography>
                  </Box>
                  <Typography fontWeight={700}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
                {i < order.items.length - 1 && <Divider />}
              </Box>
            ))}
            <Box sx={{ p: 2.5, bgcolor: '#FAFBFC', borderTop: '1px solid #E8ECF0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight={800} sx={{ fontSize: 16 }}>Total</Typography>
                <Typography fontWeight={800} color="primary" sx={{ fontSize: 18 }}>₹{order.totalAmount.toFixed(2)}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Info */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #E8ECF0' }}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>Order Info</Typography>
            {[
              { label: 'Order Date', value: format(new Date(order.createdAt), 'dd MMM yyyy') },
              { label: 'Delivery', value: order.deliveryType === 'home' ? '🚚 Home Delivery' : '🏪 Store Pickup' },
              { label: 'Payment', value: order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'store' ? 'Pay at Store' : 'Online Payment' },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{item.label}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{item.value}</Typography>
              </Box>
            ))}
          </Paper>

          {order.deliveryAddress && (
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E8ECF0' }}>
              <Typography fontWeight={700} sx={{ mb: 1.5 }}>Delivery Address</Typography>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.8 }}>
                {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailPage;

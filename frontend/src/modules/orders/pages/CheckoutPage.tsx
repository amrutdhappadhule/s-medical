import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const STEPS = ['Delivery', 'Payment', 'Confirm'];

const CheckoutPage = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [delivery, setDelivery] = useState({
    type: 'home' as 'home' | 'pickup',
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: 'Solapur',
    state: 'Maharashtra',
    pincode: '',
  });
  const [payment, setPayment] = useState<'cod' | 'store' | 'online'>('cod');

  const deliveryCharge = delivery.type === 'pickup' ? 0 : totalAmount >= 499 ? 0 : 40;
  const finalTotal = totalAmount + deliveryCharge;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await api.post('/orders/create', {
        deliveryType: delivery.type,
        paymentMethod: payment,
        deliveryAddress: delivery.type === 'home' ? { street: delivery.street, city: delivery.city, state: delivery.state, pincode: delivery.pincode } : undefined,
      });
      setOrderId((res as any)?._id || (res as any)?.orderNumber || "");
      clearCart();
      setActiveStep(3);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Success
  if (activeStep === 3) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>Order Placed! 🎉</Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>Your order has been placed successfully</Typography>
        <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: 18, mb: 4 }}>Order ID: #{orderId.slice(-8).toUpperCase()}</Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/orders')}>Track Order</Button>
          <Button variant="outlined" onClick={() => navigate('/medicines')}>Continue Shopping</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Checkout</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Step 0: Delivery */}
          {activeStep === 0 && (
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
              <Typography fontWeight={700} sx={{ mb: 2.5, fontSize: 17 }}>Delivery Method</Typography>

              <RadioGroup value={delivery.type} onChange={(e) => setDelivery({ ...delivery, type: e.target.value as any })}>
                {[
                  { value: 'home', label: 'Home Delivery', desc: 'Delivered to your address', icon: <LocalShippingIcon />, extra: totalAmount >= 499 ? 'FREE' : '₹40' },
                  { value: 'pickup', label: 'Store Pickup', desc: 'Pick up from Swami Medical, Solapur', icon: <StoreIcon />, extra: 'FREE' },
                ].map((opt) => (
                  <Paper key={opt.value} variant="outlined" onClick={() => setDelivery({ ...delivery, type: opt.value as any })}
                    sx={{
                      mb: 1.5, p: 2, cursor: 'pointer', borderRadius: 2,
                      borderColor: delivery.type === opt.value ? 'primary.main' : '#E8ECF0',
                      borderWidth: delivery.type === opt.value ? 2 : 1,
                      bgcolor: delivery.type === opt.value ? '#F0FBF8' : 'white',
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Radio value={opt.value} color="primary" />
                      <Box sx={{ color: 'primary.main' }}>{opt.icon}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700}>{opt.label}</Typography>
                        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{opt.desc}</Typography>
                      </Box>
                      <Chip label={opt.extra} size="small" sx={{ bgcolor: opt.extra === 'FREE' ? '#E8F5E9' : '#FFF8E1', color: opt.extra === 'FREE' ? '#2E7D32' : '#F57F17', fontWeight: 700 }} />
                    </Box>
                  </Paper>
                ))}
              </RadioGroup>

              {delivery.type === 'home' && (
                <Box sx={{ mt: 3 }}>
                  <Typography fontWeight={700} sx={{ mb: 2 }}>Delivery Address</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Full Name" fullWidth required value={delivery.name} onChange={(e) => setDelivery({ ...delivery, name: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Phone Number" fullWidth required value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Street Address" fullWidth required multiline rows={2} value={delivery.street} onChange={(e) => setDelivery({ ...delivery, street: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField label="City" fullWidth value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField label="State" fullWidth value={delivery.state} onChange={(e) => setDelivery({ ...delivery, state: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField label="Pincode" fullWidth required value={delivery.pincode} onChange={(e) => setDelivery({ ...delivery, pincode: e.target.value })} />
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Button variant="contained" fullWidth size="large" sx={{ mt: 3, py: 1.5 }}
                onClick={() => setActiveStep(1)}
                disabled={delivery.type === 'home' && (!delivery.name || !delivery.phone || !delivery.street || !delivery.pincode)}>
                Continue to Payment
              </Button>
            </Paper>
          )}

          {/* Step 1: Payment */}
          {activeStep === 1 && (
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
              <Typography fontWeight={700} sx={{ mb: 2.5, fontSize: 17 }}>Payment Method</Typography>

              {[
                { value: 'cod', label: 'Cash on Delivery', desc: 'Pay cash when your order arrives', icon: '💵' },
                { value: 'store', label: 'Pay at Store', desc: 'Pay when you pick up at Swami Medical', icon: '🏪' },
                { value: 'online', label: 'Online Payment (Demo)', desc: 'UPI / Net Banking / Card (demo mode)', icon: '💳' },
              ].map((opt) => (
                <Paper key={opt.value} variant="outlined" onClick={() => setPayment(opt.value as any)}
                  sx={{
                    mb: 1.5, p: 2, cursor: 'pointer', borderRadius: 2,
                    borderColor: payment === opt.value ? 'primary.main' : '#E8ECF0',
                    borderWidth: payment === opt.value ? 2 : 1,
                    bgcolor: payment === opt.value ? '#F0FBF8' : 'white',
                  }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Radio checked={payment === opt.value} color="primary" />
                    <Typography sx={{ fontSize: 22 }}>{opt.icon}</Typography>
                    <Box>
                      <Typography fontWeight={700}>{opt.label}</Typography>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{opt.desc}</Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}

              {payment === 'online' && (
                <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                  This is a demo mode. No actual payment will be processed.
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" size="large" sx={{ flex: 1, py: 1.5 }} onClick={() => setActiveStep(0)}>Back</Button>
                <Button variant="contained" size="large" sx={{ flex: 2, py: 1.5 }} onClick={() => setActiveStep(2)}>Review Order</Button>
              </Box>
            </Paper>
          )}

          {/* Step 2: Review */}
          {activeStep === 2 && (
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
              <Typography fontWeight={700} sx={{ mb: 2.5, fontSize: 17 }}>Review Your Order</Typography>
              {items.map((item) => (
                <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box>
                    <Typography fontWeight={600} sx={{ fontSize: 14 }}>{item.medicine.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Qty: {item.quantity}</Typography>
                  </Box>
                  <Typography fontWeight={700}>₹{((item.medicine.discountPrice || item.medicine.price) * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Delivery</Typography>
                <Typography fontWeight={600}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography fontWeight={700} sx={{ fontSize: 16 }}>Total</Typography>
                <Typography fontWeight={800} color="primary" sx={{ fontSize: 18 }}>₹{finalTotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" size="large" sx={{ flex: 1, py: 1.5 }} onClick={() => setActiveStep(1)}>Back</Button>
                <Button variant="contained" size="large" sx={{ flex: 2, py: 1.5 }} onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? 'Placing Order...' : `Place Order · ₹${finalTotal.toFixed(2)}`}
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Summary sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E8ECF0' }}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>Order Summary</Typography>
            {items.map((item) => (
              <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: 13, flex: 1, mr: 1 }}>{item.medicine.name} × {item.quantity}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>₹{((item.medicine.discountPrice || item.medicine.price) * item.quantity).toFixed(2)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight={700}>Total</Typography>
              <Typography fontWeight={800} color="primary">₹{finalTotal.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;

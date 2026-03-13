import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useCart } from '../../../hooks/useCart';

const CartPage = () => {
  const { items, totalAmount, itemCount, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const deliveryCharge = totalAmount >= 499 ? 0 : 40;
  const finalTotal = totalAmount + deliveryCharge;

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <ShoppingCartIcon sx={{ fontSize: 80, color: '#E8ECF0', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Your cart is empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>Add medicines to your cart and order them here</Typography>
        <Button variant="contained" component={Link} to="/medicines" size="large">
          Browse Medicines
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Shopping Cart <Chip label={`${itemCount} items`} size="small" sx={{ ml: 1, bgcolor: '#F0FBF8', color: 'primary.main', fontWeight: 700 }} />
      </Typography>

      <Grid container spacing={3}>
        {/* Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #E8ECF0' }}>
            {items.map((item, idx) => (
              <Box key={item._id}>
                <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  {/* Image */}
                  <Box sx={{ width: 80, height: 80, flexShrink: 0, borderRadius: 2, bgcolor: '#F0FBF8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {item.medicine.imageUrl ? (
                      <Box component="img" src={item.medicine.imageUrl} sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 0.5 }} />
                    ) : (
                      <MedicationIcon sx={{ fontSize: 36, color: '#00856F', opacity: 0.4 }} />
                    )}
                  </Box>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={700} sx={{ mb: 0.3, fontSize: 15 }}>{item.medicine.name}</Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>{item.medicine.manufacturer}</Typography>
                    {item.medicine.prescriptionRequired && (
                      <Chip label="Rx Required" size="small" sx={{ bgcolor: '#FFEBEE', color: '#B71C1C', fontSize: 10, height: 18, mb: 0.5 }} />
                    )}
                    <Typography sx={{ fontWeight: 800, color: 'primary.main', fontSize: 17 }}>
                      ₹{((item.medicine.discountPrice || item.medicine.price) * item.quantity).toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                      ₹{(item.medicine.discountPrice || item.medicine.price).toFixed(2)} each
                    </Typography>
                  </Box>

                  {/* Quantity + Delete */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <IconButton size="small" onClick={() => removeFromCart(item.medicine._id)} sx={{ color: 'error.main', '&:hover': { bgcolor: '#FFEBEE' } }}>
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E8ECF0', borderRadius: 2 }}>
                      <IconButton size="small" onClick={() => updateQuantity(item.medicine._id, item.quantity - 1)} sx={{ borderRadius: 0 }}>
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography sx={{ px: 1.5, fontWeight: 700, fontSize: 14 }}>{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => updateQuantity(item.medicine._id, item.quantity + 1)} sx={{ borderRadius: 0 }}>
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                {idx < items.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: 3, border: '1px solid #E8ECF0', position: { md: 'sticky' }, top: 100 }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid #E8ECF0' }}>
              <Typography fontWeight={700} sx={{ fontSize: 16 }}>Order Summary</Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>Subtotal ({itemCount} items)</Typography>
                <Typography fontWeight={600} sx={{ fontSize: 14 }}>₹{totalAmount.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocalShippingIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography color="text.secondary" sx={{ fontSize: 14 }}>Delivery</Typography>
                </Box>
                {deliveryCharge === 0 ? (
                  <Chip label="FREE" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: 11 }} />
                ) : (
                  <Typography fontWeight={600} sx={{ fontSize: 14 }}>₹{deliveryCharge}</Typography>
                )}
              </Box>
              {deliveryCharge > 0 && (
                <Typography sx={{ fontSize: 12, color: 'text.secondary', bgcolor: '#FFF8E1', borderRadius: 1.5, p: 1, mb: 1.5 }}>
                  Add ₹{(499 - totalAmount).toFixed(2)} more for free delivery
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography fontWeight={800} sx={{ fontSize: 16 }}>Total Amount</Typography>
                <Typography fontWeight={800} color="primary" sx={{ fontSize: 18 }}>₹{finalTotal.toFixed(2)}</Typography>
              </Box>
              <Button variant="contained" fullWidth size="large" endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/checkout')} sx={{ py: 1.5 }}>
                Proceed to Checkout
              </Button>
              <Button variant="outlined" fullWidth component={Link} to="/medicines" sx={{ mt: 1.5 }}>
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;

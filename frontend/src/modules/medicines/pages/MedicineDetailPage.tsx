import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VerifiedIcon from '@mui/icons-material/Verified';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MedicationIcon from '@mui/icons-material/Medication';
import InfoIcon from '@mui/icons-material/Info';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../../../hooks/useCart';
import api from '../../../services/api';
import { Medicine } from '../../../types';
import MedicineCard from '../../../components/common/MedicineCard';

const MedicineDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: medicine, isLoading } = useQuery<Medicine>({
    queryKey: ['medicine', id],
    queryFn: async () => {
      const res = await api.get(`/medicines/${id}`);
      return res as any;
    },
  });

  const { data: related } = useQuery<Medicine[]>({
    queryKey: ['related-medicines', medicine?.category],
    enabled: !!medicine,
    queryFn: async () => {
      const cat = typeof medicine!.category === 'string' ? medicine!.category : (medicine!.category as any)?._id;
      const res = await api.get(`/medicines?category=${cat}&limit=4`);
      return ((res as any)?.medicines || []).filter((m: any) => m._id !== id);
    },
  });

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (!medicine) return (
    <Container sx={{ py: 4 }}>
      <Alert severity="error">Medicine not found.</Alert>
    </Container>
  );

  const category = typeof medicine.category === 'string' ? medicine.category : (medicine.category as any)?.name;
  const discount = medicine.discountPrice
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100)
    : 0;
  const displayPrice = medicine.discountPrice || medicine.price;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 3, fontSize: 14 }}>
        <Link to="/" style={{ color: '#5C6370', textDecoration: 'none' }}>Home</Link>
        <Link to="/medicines" style={{ color: '#5C6370', textDecoration: 'none' }}>Medicines</Link>
        <Link to={`/medicines?category=${category}`} style={{ color: '#5C6370', textDecoration: 'none' }}>{category}</Link>
        <Typography sx={{ fontSize: 14, color: '#1A1A2E', fontWeight: 600 }}>{medicine.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Image */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', border: '1px solid #E8ECF0', position: 'sticky', top: 100 }}>
            {medicine.imageUrl ? (
              <Box component="img" src={medicine.imageUrl} alt={medicine.name} sx={{ maxHeight: 250, maxWidth: '100%', objectFit: 'contain' }} />
            ) : (
              <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F0FBF8', borderRadius: 2 }}>
                <MedicationIcon sx={{ fontSize: 80, color: '#00856F', opacity: 0.4 }} />
              </Box>
            )}
            {medicine.prescriptionRequired && (
              <Alert severity="warning" sx={{ mt: 2, borderRadius: 2, fontSize: 13 }}>
                <strong>Prescription Required</strong> — Please upload your prescription.
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Chip label={category} size="small" sx={{ bgcolor: '#F0FBF8', color: 'primary.main', fontWeight: 600, mb: 1.5 }} />

          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, fontSize: { xs: 22, md: 28 } }}>{medicine.name}</Typography>
          <Typography color="text.secondary" sx={{ mb: 0.5 }}>By <strong>{medicine.manufacturer}</strong></Typography>
          {medicine.composition && (
            <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 2 }}>Composition: {medicine.composition}</Typography>
          )}

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1 }}>
            <Typography variant="h4" fontWeight={800} color="primary" sx={{ fontSize: 30 }}>
              ₹{(displayPrice * quantity).toFixed(2)}
            </Typography>
            {discount > 0 && (
              <>
                <Typography sx={{ textDecoration: 'line-through', fontSize: 18, color: 'text.secondary' }}>
                  ₹{(medicine.price * quantity).toFixed(2)}
                </Typography>
                <Chip label={`${discount}% OFF`} size="small" sx={{ bgcolor: '#FF6B35', color: 'white', fontWeight: 700 }} />
              </>
            )}
          </Box>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 3 }}>
            MRP ₹{medicine.price.toFixed(2)} per unit (incl. all taxes)
          </Typography>

          {/* Stock */}
          <Box sx={{ mb: 3 }}>
            <Chip
              label={medicine.stock > 10 ? '✓ In Stock' : medicine.stock > 0 ? `Only ${medicine.stock} left` : 'Out of Stock'}
              sx={{
                bgcolor: medicine.stock > 0 ? '#E8F5E9' : '#FFEBEE',
                color: medicine.stock > 0 ? '#2E7D32' : '#B71C1C',
                fontWeight: 700,
              }}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Quantity + Cart */}
          {medicine.stock > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E8ECF0', borderRadius: 2, overflow: 'hidden' }}>
                <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} size="small" sx={{ borderRadius: 0 }}>
                  <RemoveIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography sx={{ px: 3, py: 1, fontWeight: 700, fontSize: 16, minWidth: 48, textAlign: 'center' }}>{quantity}</Typography>
                <IconButton onClick={() => setQuantity(Math.min(medicine.stock, quantity + 1))} size="small" sx={{ borderRadius: 0 }}>
                  <AddIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => addToCart(medicine, quantity)}
                sx={{ flex: 1, maxWidth: 240, py: 1.5 }}
              >
                Add to Cart
              </Button>
            </Box>
          )}

          {/* Info chips */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: '#F0FBF8', borderRadius: 2, px: 1.5, py: 1 }}>
              <LocalShippingIcon sx={{ color: 'primary.main', fontSize: 18 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Free delivery above ₹499</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, bgcolor: '#F0FBF8', borderRadius: 2, px: 1.5, py: 1 }}>
              <VerifiedIcon sx={{ color: 'primary.main', fontSize: 18 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>100% Genuine</Typography>
            </Box>
          </Box>

          {/* Medicine details table */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0', bgcolor: '#FAFBFC' }}>
            <Typography fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon sx={{ color: 'primary.main', fontSize: 20 }} /> Product Information
            </Typography>
            <Grid container spacing={1.5}>
              {[
                { label: 'Batch No.', value: medicine.batchNumber },
                { label: 'Expiry Date', value: new Date(medicine.expiryDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
                { label: 'Category', value: category },
                { label: 'Manufacturer', value: medicine.manufacturer },
                { label: 'Prescription', value: medicine.prescriptionRequired ? 'Required' : 'Not Required' },
                { label: 'Stock', value: `${medicine.stock} units` },
              ].map((item) => (
                <Grid item xs={6} key={item.label}>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{item.value || '-'}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {medicine.description && (
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0', mt: 2 }}>
              <Typography fontWeight={700} sx={{ mb: 1.5 }}>Description</Typography>
              <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.8 }}>{medicine.description}</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Related */}
      {related && related.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Related Medicines</Typography>
          <Grid container spacing={2}>
            {related.slice(0, 4).map((med) => (
              <Grid item xs={6} sm={3} key={med._id}>
                <MedicineCard medicine={med} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default MedicineDetailPage;

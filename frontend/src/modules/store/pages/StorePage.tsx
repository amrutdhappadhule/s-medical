import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedIcon from '@mui/icons-material/Verified';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const HOURS = [
  { day: 'Monday – Friday', time: '9:00 AM – 10:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 10:00 PM' },
  { day: 'Sunday', time: '10:00 AM – 9:00 PM' },
];

const StorePage = () => {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #004D40 0%, #00695C 100%)', py: 8, color: 'white', textAlign: 'center' }}>
        <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
          <StorefrontIcon sx={{ fontSize: 34 }} />
        </Box>
        <Typography variant="h3" sx={{ fontFamily: 'Sora', fontWeight: 800, mb: 1 }}>Swami Medical Shop</Typography>
        <Typography sx={{ opacity: 0.85, fontSize: 18, mb: 2 }}>Your Trusted Local Pharmacy in Solapur</Typography>
        <Chip label="Est. 2014" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Map */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #E8ECF0', height: '100%' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography fontWeight={700}>Store Location</Typography>
              </Box>
              <Box
                component="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121130.0538046!2d75.8241957!3d17.6819709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc5db5cc2a0e855%3A0x45c3e5c4fc891827!2sSolapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1637000000000!5m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                title="Swami Medical Location"
              />
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
                  📍 Swami Medical Shop, Near Civil Hospital, Solapur, Maharashtra - 413001
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Contact + Hours */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
              <Typography fontWeight={700} sx={{ mb: 2.5, fontSize: 17 }}>Contact Information</Typography>

              {[
                { icon: <PhoneIcon />, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: <WhatsAppIcon />, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
                { icon: <EmailIcon />, label: 'Email', value: 'info@swamimedical.com', href: 'mailto:info@swamimedical.com' },
                { icon: <LocationOnIcon />, label: 'Address', value: 'Near Civil Hospital, Solapur, MH - 413001', href: null },
              ].map((item) => (
                <Box key={item.label} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#F0FBF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', flexShrink: 0 }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{item.label}</Typography>
                    {item.href ? (
                      <Typography component="a" href={item.href} target="_blank" sx={{ fontSize: 14, fontWeight: 600, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {item.value}
                      </Typography>
                    ) : (
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{item.value}</Typography>
                    )}
                  </Box>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                fullWidth
                startIcon={<WhatsAppIcon />}
                href="https://wa.me/919876543210?text=Hello, I need help with medicine ordering"
                target="_blank"
                sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#20BA5C' } }}
              >
                Chat on WhatsApp
              </Button>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <AccessTimeIcon sx={{ color: 'primary.main' }} />
                <Typography fontWeight={700} sx={{ fontSize: 17 }}>Business Hours</Typography>
              </Box>
              {HOURS.map((h) => (
                <Box key={h.day} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{h.day}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#2E7D32' }}>{h.time}</Typography>
                </Box>
              ))}
              <Box sx={{ mt: 2, bgcolor: '#E8F5E9', borderRadius: 2, p: 1.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#2E7D32' }}>
                  ✓ Currently Open
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Features */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {[
            { icon: '💊', title: '1000+ Medicines', desc: 'Wide range of prescription and OTC medicines' },
            { icon: '🚚', title: 'Home Delivery', desc: 'Fast home delivery in Solapur and nearby areas' },
            { icon: '✅', title: 'Genuine Products', desc: '100% authentic medicines from certified suppliers' },
            { icon: '👨‍⚕️', title: 'Expert Advice', desc: 'Qualified pharmacists available for consultation' },
          ].map((f) => (
            <Grid item xs={6} md={3} key={f.title}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '1px solid #E8ECF0', height: '100%' }}>
                <Typography sx={{ fontSize: 36, mb: 1.5 }}>{f.icon}</Typography>
                <Typography fontWeight={700} sx={{ mb: 0.5 }}>{f.title}</Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{f.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StorePage;

import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#0F1923", color: "white", pt: 6, pb: 3, mt: "auto" }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: "linear-gradient(135deg,#00856F,#00A98A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StorefrontIcon sx={{ color: "white", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  sx={{ fontFamily: "Sora", fontWeight: 800, fontSize: 18 }}
                >
                  Swami Medical
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                  Smart Pharmacy
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.8, mb: 2 }}
            >
              Your trusted pharmacy for all healthcare needs. Quality medicines,
              expert advice, and convenient home delivery.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                href="https://wa.me/917666331044"
                target="_blank"
                sx={{
                  bgcolor: "#25D366",
                  color: "white",
                  "&:hover": { bgcolor: "#20BA5C" },
                  width: 36,
                  height: 36,
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                href="https://www.instagram.com/amrutttt___d?igsh=dTFhb2l5bnpqN2Nv"
                target="_blank"
                sx={{
                  bgcolor: "#E1306C",
                  color: "white",
                  "&:hover": { bgcolor: "#C92A61" },
                  width: 36,
                  height: 36,
                }}
              >
                <InstagramIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                href="tel:+917666332044"
                sx={{
                  bgcolor: "#1E2D3D",
                  color: "white",
                  "&:hover": { bgcolor: "#2A3D52" },
                  width: 36,
                  height: 36,
                }}
              >
                <PhoneIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick links */}
          <Grid item xs={6} md={2}>
            <Typography
              sx={{
                fontFamily: "Sora",
                fontWeight: 600,
                mb: 2,
                color: "white",
              }}
            >
              Quick Links
            </Typography>
            {[
              { label: "Home", path: "/home" },
              { label: "Medicines", path: "/medicines" },
              { label: "Store Info", path: "/store" },
              { label: "My Orders", path: "/orders" },
              { label: "Upload Prescription", path: "/prescriptions" },
            ].map((item) => (
              <Typography
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  display: "block",
                  color: "#9CA3AF",
                  fontSize: 14,
                  mb: 1,
                  textDecoration: "none",
                  "&:hover": { color: "#00A98A" },
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Grid>

          {/* Categories */}
          <Grid item xs={6} md={2}>
            <Typography sx={{ fontFamily: "Sora", fontWeight: 600, mb: 2 }}>
              Categories
            </Typography>
            {[
              "Tablets",
              "Syrups",
              "Vitamins",
              "Injections",
              "Medical Devices",
              "Skincare",
            ].map((cat) => (
              <Typography
                key={cat}
                component={Link}
                to={`/medicines?category=${cat.toLowerCase()}`}
                sx={{
                  display: "block",
                  color: "#9CA3AF",
                  fontSize: 14,
                  mb: 1,
                  textDecoration: "none",
                  "&:hover": { color: "#00A98A" },
                  transition: "color 0.2s",
                }}
              >
                {cat}
              </Typography>
            ))}
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontFamily: "Sora", fontWeight: 600, mb: 2 }}>
              Contact Us
            </Typography>

            <Box
              component="a"
              href="https://www.google.com/maps/search/?api=1&query=Swami+Medical+Shop+Shelgi+Solapur"
              target="_blank"
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 1.5,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { opacity: 0.85 },
              }}
            >
              <LocationOnIcon
                sx={{ color: "#00A98A", fontSize: 18, mt: 0.2, flexShrink: 0 }}
              />

              <Typography
                sx={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.6 }}
              >
                Swami Medical Shop, mahalakshmi society shelgi, Solapur,
                Maharashtra - 413006
              </Typography>
            </Box>

            <Box
              component="a"
              href="tel:+919423754244"
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 1.5,
                alignItems: "center",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { opacity: 0.85 },
              }}
            >
              <PhoneIcon
                sx={{ color: "#00A98A", fontSize: 18, flexShrink: 0 }}
              />

              <Typography sx={{ fontSize: 14, color: "#9CA3AF" }}>
                +91 94237 54244
              </Typography>
            </Box>

            <Box
              component="a"
              // href="mailto:dhappadhuleamrut@gmail.com"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=dhappadhuleamrut@gmail.com"
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 1.5,
                alignItems: "center",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { opacity: 0.85 },
              }}
            >
              <EmailIcon
                sx={{ color: "#00A98A", fontSize: 18, flexShrink: 0 }}
              />

              <Typography sx={{ fontSize: 14, color: "#9CA3AF" }}>
                dhappadhuleamrut@gmail.com
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <AccessTimeIcon
                sx={{ color: "#00A98A", fontSize: 18, flexShrink: 0 }}
              />
              <Typography sx={{ fontSize: 14, color: "#9CA3AF" }}>
                Mon – Sun: 9:00 AM – 11:00 PM
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#1E2D3D", my: 4 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 13, color: "#6B7280" }}>
            © 2024 Swami Medical. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

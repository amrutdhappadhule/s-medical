import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { useQuery } from "@tanstack/react-query";
import SearchIcon from "@mui/icons-material/Search";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MedicationIcon from "@mui/icons-material/Medication";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MedicineCard from "../../../components/common/MedicineCard";
import api from "../../../services/api";
import { Medicine } from "../../../types";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

const categories = [
  { name: "Tablets", icon: "💊", color: "#E3F2FD", textColor: "#1565C0" },
  { name: "Syrups", icon: "🧴", color: "#F3E5F5", textColor: "#6A1B9A" },
  { name: "Vitamins", icon: "⚡", color: "#FFF8E1", textColor: "#F57F17" },
  { name: "Injections", icon: "💉", color: "#FCE4EC", textColor: "#C62828" },
  {
    name: "Medical Devices",
    icon: "🩺",
    color: "#E8F5E9",
    textColor: "#2E7D32",
  },
  { name: "Skincare", icon: "✨", color: "#FBE9E7", textColor: "#BF360C" },
  { name: "Baby Care", icon: "👶", color: "#E0F7FA", textColor: "#00695C" },
  { name: "Eye Drops", icon: "👁️", color: "#F1F8E9", textColor: "#33691E" },
];

const features = [
  {
    icon: <LocalShippingIcon />,
    title: "Home Delivery",
    desc: "Free delivery on orders above ₹499",
  },
  {
    icon: <VerifiedIcon />,
    title: "Genuine Medicines",
    desc: "100% authentic & certified products",
  },
  {
    icon: <SupportAgentIcon />,
    title: "24/7 Support",
    desc: "Expert pharmacist consultation",
  },
  {
    icon: <MedicationIcon />,
    title: "1000+ Medicines",
    desc: "Wide range of medicines available",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);

  const { data: featuredMedicines } = useQuery({
    queryKey: ["featured-medicines"],
    queryFn: async () => {
      const res = await api.get("/medicines?limit=8&sort=popular");
      return (res as any)?.medicines || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim())
      navigate(`/medicines?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #004D40 0%, #00695C 40%, #00897B 100%)",
          pt: { xs: 6, md: 8 },
          pb: { xs: 8, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorations */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="🏥 Solapur's Trusted Pharmacy"
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  mb: 2,
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  color: "white",
                  fontSize: { xs: "2rem", md: "3rem" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Your Health, Our{" "}
                <Box component="span" sx={{ color: "#A5F3FC" }}>
                  Priority
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: { xs: 15, md: 17 },
                  lineHeight: 1.8,
                  mb: 4,
                  maxWidth: 500,
                }}
              >
                Order medicines online from Swami Medical Shop. Fast delivery,
                genuine products, and expert care — all in one place.
              </Typography>

              {/* Order with Prescription */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <UploadFileIcon sx={{ color: "#A5F3FC", fontSize: 20 }} />

                <Typography sx={{ color: "#E0F7FA", fontSize: 14 }}>
                  Order with prescription.
                </Typography>

                <Typography
                  onClick={() => setOpenPrescriptionModal(true)}
                  sx={{
                    color: "#A5F3FC",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  UPLOAD NOW
                </Typography>
              </Box>

              {/* Search bar */}
              <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  maxWidth: 520,
                }}
              >
                <SearchIcon sx={{ color: "#6B7280", mx: 2 }} />
                <InputBase
                  placeholder="Search for medicines, vitamins, devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ flex: 1, py: 1.5, fontSize: 15 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ m: 0.5, borderRadius: 2, py: 1.2, px: 3 }}
                >
                  Search
                </Button>
              </Paper>

              <Box sx={{ display: "flex", gap: 1.5, mt: 3, flexWrap: "wrap" }}>
                {["Paracetamol", "Vitamin C", "BP Medicines", "Insulin"].map(
                  (tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onClick={() => navigate(`/medicines?search=${tag}`)}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.15)",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: 500,
                        "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                      }}
                    />
                  ),
                )}
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={5}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                {[
                  { val: "1000+", label: "Medicines" },
                  { val: "500+", label: "Happy Customers" },
                  { val: "2+", label: "Years Experience" },
                  { val: "100%", label: "Genuine Products" },
                ].map((stat) => (
                  <Paper
                    key={stat.val}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      textAlign: "center",
                      background: "rgba(255,255,255,0.10)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "all 0.25s ease",
                      cursor: "default",

                      "&:hover": {
                        transform: "translateY(-4px)",
                        background: "rgba(255,255,255,0.15)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 32,
                        letterSpacing: 0.5,
                        color: "#A5F3FC",
                        mb: 0.5,
                      }}
                    >
                      {stat.val}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.85)",
                        letterSpacing: 0.3,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features strip */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #E8ECF0", mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {features.map((f) => (
              <Grid item xs={12} sm={6} md={3} key={f.title}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#c0ffcc",
                    border: "1px solid #EEF2F6",
                    transition: "all 0.25s ease",
                    height: "100%",

                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                      bgcolor: "#c0ffcc",
                    },
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      bgcolor: "#E8F8F3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                      flexShrink: 0,
                      fontSize: 20,
                    }}
                  >
                    {f.icon}
                  </Box>

                  {/* Text */}
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#1A1A2E",
                        mb: 0.2,
                      }}
                    >
                      {f.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#6B7280",
                        lineHeight: 1.4,
                      }}
                    >
                      {f.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 20, md: 26 },
                color: "#111827",
              }}
            >
              Shop by Category
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              Find medicines by their category
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/medicines"
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontWeight: 600,
              color: "primary.main",
              textTransform: "none",
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            View All
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          {categories.map((cat) => (
            <Grid item xs={6} sm={3} md={1.5} key={cat.name}>
              <Card
                onClick={() => navigate(`/medicines?category=${cat.name}`)}
                sx={{
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: 4,
                  p: 2,
                  bgcolor: cat.color,
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  transition: "all 0.25s ease",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: "10px !important" }}>
                  {/* Icon Circle */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.75)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1.5,
                      fontSize: 28,
                      transition: "all 0.25s",
                    }}
                  >
                    {cat.icon}
                  </Box>

                  {/* Category Name */}
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: cat.textColor,
                      letterSpacing: 0.2,
                    }}
                  >
                    {cat.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Medicines */}
      <Box sx={{ bgcolor: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, fontSize: { xs: 20, md: 24 } }}
              >
                Popular Medicines
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
                Most ordered medicines at Swami Medical
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/medicines"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 600 }}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={2}>
            {(featuredMedicines || Array(8).fill(null)).map((med, i) => (
              <Grid item xs={6} sm={4} md={3} key={med?._id || i}>
                {med ? (
                  <MedicineCard medicine={med} />
                ) : (
                  <MedicineCardSkeleton />
                )}
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Prescription upload banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1A237E 0%, #283593 100%)",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Chip
                label="Easy & Secure"
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  mb: 1.5,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: { xs: 20, md: 26 },
                }}
              >
                Have a Doctor's Prescription?
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 15,
                  lineHeight: 1.8,
                }}
              >
                Upload your prescription and we'll prepare your order. Our
                pharmacist will verify and process it quickly.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
              <Button
                component={Link}
                to="/prescriptions"
                variant="contained"
                size="large"
                startIcon={<UploadFileIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#1A237E",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#F5F5F5",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  },
                }}
              >
                Upload Prescription
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* WhatsApp floating button */}
      <Box
        component="a"
        href="https://wa.me/917666331044?text=Hello, I need help with medicine ordering"
        target="_blank"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "#25D366",
          color: "white",
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.5)",
          zIndex: 1000,
          transition: "all 0.2s",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 6px 28px rgba(37,211,102,0.6)",
          },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 28 }} />
      </Box>
      <Dialog
        open={openPrescriptionModal}
        onClose={() => setOpenPrescriptionModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Order Medicines with Prescription
          {/* Close Button */}
          <Button
            onClick={() => setOpenPrescriptionModal(false)}
            sx={{
              minWidth: 0,
              fontSize: 18,
              color: "text.secondary",
            }}
          >
            ✕
          </Button>
        </DialogTitle>

        <DialogContent>
          {/* Description */}
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            Send your doctor's prescription directly to our pharmacist on
            WhatsApp. Our team will verify the prescription and prepare your
            medicines for **same-day delivery anywhere in Solapur.**
          </Typography>

          {/* Steps */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 13, mb: 0.5 }}>
              📄 Upload prescription on WhatsApp
            </Typography>

            <Typography sx={{ fontSize: 13, mb: 0.5 }}>
              👨‍⚕️ Pharmacist verifies your medicines
            </Typography>

            <Typography sx={{ fontSize: 13 }}>
              🚚 Fast home delivery to your doorstep
            </Typography>
          </Box>

          {/* WhatsApp Button */}
          <Button
            component="a"
            href="https://wa.me/917666331044?text=Hello%20Swami%20Medical,%20I%20want%20to%20order%20medicines%20using%20my%20prescription."
            target="_blank"
            fullWidth
            startIcon={<WhatsAppIcon />}
            sx={{
              bgcolor: "#25D366",
              color: "white",
              fontWeight: 700,
              py: 1.3,
              borderRadius: 2,
              fontSize: 15,
              "&:hover": {
                bgcolor: "#1EBE5D",
              },
            }}
          >
            Send Prescription on WhatsApp
          </Button>

          {/* Trust text */}
          <Typography
            sx={{
              fontSize: 12,
              textAlign: "center",
              color: "text.secondary",
              mt: 2,
            }}
          >
            Trusted by 500+ customers in Solapur
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Skeleton component
const MedicineCardSkeleton = () => (
  <Card sx={{ height: 280, border: "1px solid #F0F4F8" }}>
    <Box sx={{ height: 130, bgcolor: "#F5F7FA", animate: "pulse" }} />
    <CardContent>
      <Box
        sx={{
          height: 12,
          width: "40%",
          bgcolor: "#E8ECF0",
          borderRadius: 1,
          mb: 1,
        }}
      />
      <Box
        sx={{
          height: 16,
          width: "80%",
          bgcolor: "#E8ECF0",
          borderRadius: 1,
          mb: 0.8,
        }}
      />
      <Box
        sx={{
          height: 12,
          width: "60%",
          bgcolor: "#E8ECF0",
          borderRadius: 1,
          mb: 2,
        }}
      />
      <Box
        sx={{ height: 20, width: "30%", bgcolor: "#E8ECF0", borderRadius: 1 }}
      />
    </CardContent>
  </Card>
);

export default HomePage;

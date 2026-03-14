// import React, { useState } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import {
//   AppBar, Toolbar, Box, Typography, IconButton, Badge,
//   Avatar, Menu, MenuItem, Divider, InputBase, Button,
//   Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme
// } from '@mui/material'
// import {
//   Search, ShoppingCart, Person, Logout, Receipt,
//   UploadFile, Menu as MenuIcon, Home, MedicalServices,
//   Dashboard, Store, Close, LocalPharmacy
// } from '@mui/icons-material'
// import { useAuthStore } from '../../store/authStore'
// import { useCartStore } from '../../store/cartStore'

// export default function Navbar() {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'))
//   const { user, isAuthenticated, isAdmin, logout } = useAuthStore()
//   const totalItems = useCartStore((s) => s.totalItems)
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [mobileOpen, setMobileOpen] = useState(false)

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (searchQuery.trim()) {
//       navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`)
//       setSearchQuery('')
//     }
//   }

//   const navLinks = [
//     { label: 'Home', path: '/', icon: <Home /> },
//     { label: 'Medicines', path: '/medicines', icon: <MedicalServices /> },
//     { label: 'Store', path: '/store', icon: <Store /> },
//   ]

//   return (
//     <>
//       <AppBar position="sticky" sx={{ background: '#fff', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }} elevation={0}>
//         <Box sx={{ bgcolor: 'primary.main', py: 0.5 }}>
//           <Box sx={{ maxWidth: 1280, mx: 'auto', px: 2, display: 'flex', justifyContent: 'space-between' }}>
//             <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>📍 Solapur, Maharashtra | ⏰ 9 AM – 10 PM</Typography>
//             <Typography variant="caption" sx={{ color: 'white', opacity: 0.9, display: { xs: 'none', sm: 'block' } }}>📞 +91 98765 43210 | Free delivery above ₹500</Typography>
//           </Box>
//         </Box>
//         <Toolbar sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: { xs: 1, md: 2 }, minHeight: '64px !important' }}>
//           {isMobile && <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}><MenuIcon /></IconButton>}
//           <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', mr: 3, flexShrink: 0 }}>
//             <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #1a9e5e, #137a49)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <LocalPharmacy sx={{ color: 'white', fontSize: 20 }} />
//             </Box>
//             <Box>
//               <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1, fontSize: '16px' }}>Swami Medical</Typography>
//               <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '10px' }}>Smart Pharmacy</Typography>
//             </Box>
//           </Box>
//           {!isMobile && (
//             <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, mx: 2, display: 'flex', alignItems: 'center', bgcolor: '#f5f7fa', borderRadius: '10px', px: 2, py: 0.5, border: '1.5px solid transparent', transition: 'all 0.2s', '&:focus-within': { border: '1.5px solid', borderColor: 'primary.main', bgcolor: 'white', boxShadow: '0 0 0 3px rgba(26,158,94,0.1)' } }}>
//               <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
//               <InputBase placeholder="Search medicines, brands, health products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ flex: 1, fontSize: '14px' }} />
//             </Box>
//           )}
//           {!isMobile && (
//             <Box sx={{ display: 'flex', gap: 0.5, mx: 1 }}>
//               {navLinks.map((link) => (
//                 <Button key={link.path} component={Link} to={link.path} sx={{ color: location.pathname === link.path ? 'primary.main' : 'text.secondary', fontWeight: location.pathname === link.path ? 700 : 500, fontSize: '13px', px: 1.5 }}>
//                   {link.label}
//                 </Button>
//               ))}
//               {isAdmin && <Button component={Link} to="/admin" sx={{ color: 'secondary.main', fontWeight: 600, fontSize: '13px', px: 1.5 }}>Dashboard</Button>}
//             </Box>
//           )}
//           {isAuthenticated && (
//             <IconButton component={Link} to="/cart" sx={{ ml: 1 }}>
//               <Badge badgeContent={totalItems} color="primary">
//                 <ShoppingCart sx={{ color: totalItems > 0 ? 'primary.main' : 'text.secondary', fontSize: 22 }} />
//               </Badge>
//             </IconButton>
//           )}
//           {isAuthenticated ? (
//             <>
//               <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
//                 <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}>
//                   {user?.name?.[0]?.toUpperCase()}
//                 </Avatar>
//               </IconButton>
//               <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
//                 PaperProps={{ sx: { borderRadius: 2, mt: 1, minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } }}
//                 transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//                 anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
//                 <Box sx={{ px: 2, py: 1.5 }}>
//                   <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
//                   <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
//                 </Box>
//                 <Divider />
//                 <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null) }}><Person sx={{ mr: 1.5, fontSize: 18 }} /> My Profile</MenuItem>
//                 <MenuItem onClick={() => { navigate('/orders'); setAnchorEl(null) }}><Receipt sx={{ mr: 1.5, fontSize: 18 }} /> My Orders</MenuItem>
//                 <MenuItem onClick={() => { navigate('/prescriptions'); setAnchorEl(null) }}><UploadFile sx={{ mr: 1.5, fontSize: 18 }} /> Prescriptions</MenuItem>
//                 {isAdmin && (<><Divider /><MenuItem onClick={() => { navigate('/admin'); setAnchorEl(null) }}><Dashboard sx={{ mr: 1.5, fontSize: 18, color: 'secondary.main' }} /><Typography color="secondary.main" fontWeight={600}>Admin Panel</Typography></MenuItem></>)}
//                 <Divider />
//                 <MenuItem onClick={() => { logout(); setAnchorEl(null); navigate('/') }} sx={{ color: 'error.main' }}><Logout sx={{ mr: 1.5, fontSize: 18 }} /> Logout</MenuItem>
//               </Menu>
//             </>
//           ) : (
//             <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
//               <Button component={Link} to="/login" variant="outlined" size="small" sx={{ fontSize: '13px' }}>Login</Button>
//               <Button component={Link} to="/register" variant="contained" size="small" sx={{ fontSize: '13px' }}>Sign Up</Button>
//             </Box>
//           )}
//         </Toolbar>
//         {isMobile && (
//           <Box component="form" onSubmit={handleSearch} sx={{ px: 2, pb: 1.5, display: 'flex', alignItems: 'center', bgcolor: '#f5f7fa', mx: 2, borderRadius: '10px', mb: 1 }}>
//             <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
//             <InputBase placeholder="Search medicines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ flex: 1, fontSize: '13px' }} fullWidth />
//           </Box>
//         )}
//       </AppBar>
//       <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 280 } }}>
//         <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h6" fontWeight={800} color="primary.main">Menu</Typography>
//           <IconButton onClick={() => setMobileOpen(false)}><Close /></IconButton>
//         </Box>
//         <Divider />
//         <List>
//           {navLinks.map((link) => (
//             <ListItem key={link.path} component={Link} to={link.path} onClick={() => setMobileOpen(false)} sx={{ color: 'text.primary', textDecoration: 'none' }}>
//               <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>{link.icon}</ListItemIcon>
//               <ListItemText primary={link.label} />
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>
//     </>
//   )
// }

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Logout,
  Receipt,
  UploadFile,
  Menu as MenuIcon,
  Home,
  MedicalServices,
  Dashboard,
  Store,
  Close,
  LocalPharmacy,
} from "@mui/icons-material";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/", icon: <Home /> },
    { label: "Medicines", path: "/medicines", icon: <MedicalServices /> },
    { label: "Store", path: "/store", icon: <Store /> },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "#fff",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            maxWidth: 1280,
            width: "100%",
            mx: "auto",
            px: { xs: 1, md: 2 },
            minHeight: "64px !important",
          }}
        >
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              mr: 3,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1a9e5e, #137a49)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LocalPharmacy sx={{ color: "white", fontSize: 20 }} />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  lineHeight: 1,
                  fontSize: "16px",
                }}
              >
                Swami Medical
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "10px",
                }}
              >
                Smart Pharmacy
              </Typography>
            </Box>
          </Box>

          {/* Order + Call Section */}
          {!isMobile && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                ml: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                Order anywhere from <b>Solapur</b>
              </Typography>

              <Button
                component="a"
                href="tel:+919876543210"
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  px: 2,
                  fontSize: "13px",
                }}
              >
                Call Now
              </Button>
            </Box>
          )}

          {/* Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, mx: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color:
                      location.pathname === link.path
                        ? "primary.main"
                        : "text.secondary",
                    fontWeight: location.pathname === link.path ? 700 : 500,
                    fontSize: "13px",
                    px: 1.5,
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {isAdmin && (
                <Button
                  component={Link}
                  to="/admin"
                  sx={{
                    color: "secondary.main",
                    fontWeight: 600,
                    fontSize: "13px",
                    px: 1.5,
                  }}
                >
                  Dashboard
                </Button>
              )}
            </Box>
          )}

          {/* Cart */}
          {/* {isAuthenticated && ( */}
          <IconButton component={Link} to="/cart" sx={{ ml: 1 }}>
            <Badge badgeContent={totalItems} color="primary">
              <ShoppingCart
                sx={{
                  color: totalItems > 0 ? "primary.main" : "text.secondary",
                  fontSize: 22,
                }}
              />
            </Badge>
          </IconButton>
          {/* )} */}

          {/* User Menu */}
          {isAuthenticated ? (
            <>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "primary.main",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 200,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>

                <Divider />

                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    setAnchorEl(null);
                  }}
                >
                  <Person sx={{ mr: 1.5, fontSize: 18 }} /> My Profile
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/orders");
                    setAnchorEl(null);
                  }}
                >
                  <Receipt sx={{ mr: 1.5, fontSize: 18 }} /> My Orders
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/prescriptions");
                    setAnchorEl(null);
                  }}
                >
                  <UploadFile sx={{ mr: 1.5, fontSize: 18 }} /> Prescriptions
                </MenuItem>

                {isAdmin && (
                  <>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        navigate("/admin");
                        setAnchorEl(null);
                      }}
                    >
                      <Dashboard
                        sx={{
                          mr: 1.5,
                          fontSize: 18,
                          color: "secondary.main",
                        }}
                      />
                      <Typography color="secondary.main" fontWeight={600}>
                        Admin Panel
                      </Typography>
                    </MenuItem>
                  </>
                )}

                <Divider />

                <MenuItem
                  onClick={() => {
                    logout();
                    setAnchorEl(null);
                    navigate("/");
                  }}
                  sx={{ color: "error.main" }}
                >
                  <Logout sx={{ mr: 1.5, fontSize: 18 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="small"
                sx={{ fontSize: "13px" }}
              >
                Login
              </Button>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="small"
                sx={{ fontSize: "13px" }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={800} color="primary.main">
            Menu
          </Typography>

          <IconButton onClick={() => setMobileOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Divider />

        <List>
          {navLinks.map((link) => (
            <ListItem
              key={link.path}
              component={Link}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                color: "text.primary",
                textDecoration: "none",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: "primary.main",
                }}
              >
                {link.icon}
              </ListItemIcon>

              <ListItemText primary={link.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

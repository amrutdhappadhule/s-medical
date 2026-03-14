// import React, { useState } from 'react'
// import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
// import {
//   Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemButton,
//   ListItemIcon, ListItemText, Typography, IconButton, Avatar, Divider, Chip
// } from '@mui/material'
// import {
//   Dashboard, Medication, ShoppingCart, Assignment, BarChart,
//   Logout, Menu as MenuIcon, Storefront
// } from '@mui/icons-material'
// import { useAuthStore } from '../store/authStore'
// import { useMediaQuery, useTheme } from '@mui/material'

// const DRAWER_WIDTH = 260

// const navItems = [
//   { label: 'Dashboard', icon: <Dashboard />, path: '/admin' },
//   { label: 'Medicines', icon: <Medication />, path: '/admin/medicines' },
//   { label: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
//   { label: 'Prescriptions', icon: <Assignment />, path: '/admin/prescriptions' },
//   { label: 'Analytics', icon: <BarChart />, path: '/admin/analytics' },
// ]

// export default function AdminLayout() {
//   const { user, logout } = useAuthStore()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'))
//   const [mobileOpen, setMobileOpen] = useState(false)

//   const drawerContent = (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0F1923', color: 'white' }}>
//       <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
//         <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #1a9e5e, #137a49)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           <Storefront sx={{ color: 'white', fontSize: 22 }} />
//         </Box>
//         <Box>
//           <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'white', lineHeight: 1.2 }}>Swami Medical</Typography>
//           <Typography sx={{ fontSize: 11, color: '#6B7280' }}>Admin Panel</Typography>
//         </Box>
//       </Box>
//       <Divider sx={{ borderColor: '#1E2D3D' }} />
//       <List sx={{ flex: 1, px: 1.5, py: 2 }}>
//         {navItems.map((item) => {
//           const isActive = location.pathname === item.path
//           return (
//             <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
//               <ListItemButton
//                 component={Link} to={item.path}
//                 onClick={() => setMobileOpen(false)}
//                 sx={{
//                   borderRadius: 2, color: isActive ? 'white' : '#8899A6',
//                   bgcolor: isActive ? 'rgba(26,158,94,0.2)' : 'transparent',
//                   borderLeft: isActive ? '3px solid #1a9e5e' : '3px solid transparent',
//                   '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: 'white' },
//                   py: 1.2, px: 2,
//                 }}
//               >
//                 <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }} />
//               </ListItemButton>
//             </ListItem>
//           )
//         })}
//       </List>
//       <Divider sx={{ borderColor: '#1E2D3D' }} />
//       <Box sx={{ p: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
//           <Avatar sx={{ width: 36, height: 36, bgcolor: '#1a9e5e', fontSize: 14, fontWeight: 600 }}>
//             {user?.name?.[0]?.toUpperCase()}
//           </Avatar>
//           <Box sx={{ flex: 1, minWidth: 0 }}>
//             <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.name}</Typography>
//             <Chip label="Admin" size="small" sx={{ bgcolor: 'rgba(26,158,94,0.3)', color: '#4db87f', fontSize: 10, height: 18 }} />
//           </Box>
//         </Box>
//         <ListItemButton onClick={() => { logout(); navigate('/') }} sx={{ borderRadius: 2, color: '#8899A6', '&:hover': { color: '#E53935', bgcolor: 'rgba(229,57,53,0.08)' }, py: 1, px: 1.5 }}>
//           <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}><Logout sx={{ fontSize: 18 }} /></ListItemIcon>
//           <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13 }} />
//         </ListItemButton>
//       </Box>
//     </Box>
//   )

//   return (
//     <Box sx={{ display: 'flex', bgcolor: '#F5F7FA', minHeight: '100vh' }}>
//       {!isMobile && (
//         <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
//           {drawerContent}
//         </Drawer>
//       )}
//       <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
//         {drawerContent}
//       </Drawer>
//       <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
//         {isMobile && (
//           <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #E8ECF0' }}>
//             <Toolbar>
//               <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#1A1A2E' }}><MenuIcon /></IconButton>
//               <Typography sx={{ fontWeight: 700, color: '#1A1A2E', ml: 1 }}>Admin Panel</Typography>
//             </Toolbar>
//           </AppBar>
//         )}
//         <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   )
// }

import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import {
  Dashboard,
  Medication,
  ShoppingCart,
  Assignment,
  BarChart,
  Logout,
  Menu as MenuIcon,
  Storefront,
} from "@mui/icons-material";
import { useAuthStore } from "../store/authStore";
import { useMediaQuery, useTheme } from "@mui/material";

const DRAWER_WIDTH = 260;

const navItems = [
  { label: "Dashboard", icon: <Dashboard />, path: "/admin" },
  { label: "Medicines", icon: <Medication />, path: "/admin/medicines" },
  { label: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
  {
    label: "Prescriptions",
    icon: <Assignment />,
    path: "/admin/prescriptions",
  },
  { label: "Analytics", icon: <BarChart />, path: "/admin/analytics" },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0F1923",
        color: "white",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: "linear-gradient(135deg, #1a9e5e, #137a49)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Storefront sx={{ color: "white", fontSize: 22 }} />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 16,
              color: "white",
              lineHeight: 1.2,
            }}
          >
            Swami Medical
          </Typography>

          <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "#1E2D3D" }} />

      {/* Navigation */}
      <List
        sx={{
          flex: 1,
          px: 1.5,
          py: 2,
          overflowY: "auto",
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  color: isActive ? "white" : "#8899A6",
                  bgcolor: isActive ? "rgba(26,158,94,0.18)" : "transparent",
                  borderLeft: isActive
                    ? "3px solid #1a9e5e"
                    : "3px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "white",
                  },
                  py: 1.2,
                  px: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "#1E2D3D" }} />

      {/* Admin Profile */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#1a9e5e",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: "white",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {user?.name}
            </Typography>

            <Chip
              label="Admin"
              size="small"
              sx={{
                bgcolor: "rgba(26,158,94,0.3)",
                color: "#4db87f",
                fontSize: 10,
                height: 18,
              }}
            />
          </Box>
        </Box>

        {/* Logout */}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#8899A6",
            "&:hover": {
              color: "#E53935",
              bgcolor: "rgba(229,57,53,0.08)",
            },
            py: 1,
            px: 1.5,
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
            <Logout sx={{ fontSize: 18 }} />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 13,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#F5F7FA",
        minHeight: "100vh",
      }}
    >
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              border: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Mobile Header */}
        {isMobile && (
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              bgcolor: "white",
              borderBottom: "1px solid #E8ECF0",
            }}
          >
            <Toolbar>
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ color: "#1A1A2E" }}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1A1A2E",
                  ml: 1,
                }}
              >
                Admin Panel
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

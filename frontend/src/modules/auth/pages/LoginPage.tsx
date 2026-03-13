import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box, Container, Paper, Typography, TextField, Button,
  InputAdornment, IconButton, Divider, Alert
} from '@mui/material'
import { Storefront, Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import toast from 'react-hot-toast'
import api from '../../../services/api'
import { useAuthStore } from '../../../store/authStore'

export default function LoginPage() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data: any = await api.post('/auth/login', form)
      setAuth(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #F0FBF8 0%, #E8F5F0 100%)' }}>
      <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, width: '100%', boxShadow: '0 8px 48px rgba(0,0,0,0.10)' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: 3, background: 'linear-gradient(135deg, #1a9e5e, #137a49)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <Storefront sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" fontWeight={800}>Welcome Back</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>Sign in to Swami Medical</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email Address" type="email" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth label="Password" required
              type={showPass ? 'text' : 'password'}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ py: 1.5, fontSize: '15px', mb: 2 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ p: 2, bgcolor: '#f0faf5', borderRadius: 2, mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} mb={0.5}>Demo Credentials:</Typography>
            <Typography variant="caption" color="text.secondary" display="block">Admin: admin@swamimedical.com / Admin@123</Typography>
            <Typography variant="caption" color="text.secondary" display="block">Customer: Register a new account</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography align="center" variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1a9e5e', fontWeight: 600, textDecoration: 'none' }}>Register Now</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

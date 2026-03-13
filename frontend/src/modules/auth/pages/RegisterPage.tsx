import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Container, Paper, Typography, TextField, Button, InputAdornment, IconButton, Alert, Grid } from '@mui/material'
import { LocalPharmacy, Visibility, VisibilityOff, Email, Lock, Person, Phone } from '@mui/icons-material'
import toast from 'react-hot-toast'
import api from '../../../services/api'
import { useAuthStore } from '../../../store/authStore'

export default function RegisterPage() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const data: any = await api.post('/auth/register', {
        name: form.name, email: form.email, password: form.password, phone: form.phone
      })
      setAuth(data.user, data.token)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
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
              <LocalPharmacy sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" fontWeight={800}>Create Account</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>Join Swami Medical today</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
              sx={{ mb: 2 }} />
            <TextField fullWidth label="Email Address" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
              sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone Number" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
              sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" required
              type={showPass ? 'text' : 'password'} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} edge="end">{showPass ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
              }}
              sx={{ mb: 2 }} />
            <TextField fullWidth label="Confirm Password" required
              type={showPass ? 'text' : 'password'} value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
              sx={{ mb: 3 }} />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ py: 1.5, fontSize: '15px', mb: 2 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          <Typography align="center" variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1a9e5e', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

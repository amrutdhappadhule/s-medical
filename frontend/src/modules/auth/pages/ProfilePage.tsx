import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res as any);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setChangingPass(true);
    try {
      await api.put('/users/change-password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password changed successfully');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>My Profile</Typography>

      <Grid container spacing={3}>
        {/* Profile summary card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0', textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32, fontWeight: 800, mx: 'auto', mb: 2 }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>{user?.name}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>{user?.email}</Typography>
            {user?.phone && <Typography sx={{ fontSize: 14, mt: 0.5 }}>{user.phone}</Typography>}
            <Box sx={{ mt: 2, bgcolor: user?.role === 'admin' ? '#F0FBF8' : '#F5F7FA', borderRadius: 2, py: 0.8, px: 2 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: user?.role === 'admin' ? 'primary.main' : 'text.secondary', textTransform: 'capitalize' }}>
                {user?.role}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 2 }}>
              Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : ''}
            </Typography>
          </Paper>
        </Grid>

        {/* Edit form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
            <Typography fontWeight={700} sx={{ mb: 2.5, fontSize: 17 }}>Personal Information</Typography>
            <Box component="form" onSubmit={handleUpdateProfile}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Full Name" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    InputProps={{ startAdornment: <PersonIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} /> }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Email Address" fullWidth value={user?.email} disabled
                    InputProps={{ startAdornment: <EmailIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} /> }}
                    helperText="Email cannot be changed"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Phone Number" fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    InputProps={{ startAdornment: <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} /> }}
                  />
                </Grid>
              </Grid>
              <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E8ECF0' }}>
            <Typography fontWeight={700} sx={{ mb: 2.5, fontSize: 17 }}>Change Password</Typography>
            <Box component="form" onSubmit={handleChangePassword}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Current Password" type="password" fullWidth required value={passForm.currentPassword} onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="New Password" type="password" fullWidth required value={passForm.newPassword} onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Confirm New Password" type="password" fullWidth required value={passForm.confirmPassword} onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })} />
                </Grid>
              </Grid>
              <Button type="submit" variant="outlined" sx={{ mt: 3 }} disabled={changingPass}>
                {changingPass ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;

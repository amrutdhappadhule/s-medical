import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { Medicine } from '../../../types';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tablets', 'Syrups', 'Vitamins', 'Injections', 'Medical Devices', 'Skincare', 'Baby Care', 'Eye Drops', 'Other'];

const EMPTY_FORM = {
  name: '', category: '', composition: '', manufacturer: '',
  price: '', discountPrice: '', stock: '', expiryDate: '',
  batchNumber: '', description: '', prescriptionRequired: false,
};

const AdminMedicinesPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-medicines', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '10', ...(search && { search }) });
      const res = await api.get(`/medicines?${params}`);
      return res as any;
    },
  });

  const medicines: Medicine[] = (data as any)?.medicines || [];
  const totalPages = data?.totalPages || 1;

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editId) return api.put(`/medicines/${editId}`, payload);
      return api.post('/medicines', payload);
    },
    onSuccess: () => {
      toast.success(editId ? 'Medicine updated!' : 'Medicine added!');
      queryClient.invalidateQueries({ queryKey: ['admin-medicines'] });
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      setEditId(null);
    },
    onError: (err: any) => toast.error(err.message || 'Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/medicines/${id}`),
    onSuccess: () => {
      toast.success('Medicine deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-medicines'] });
      setDeleteDialog(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const handleEdit = (med: Medicine) => {
    setEditId(med._id);
    setForm({
      name: med.name,
      category: typeof med.category === 'string' ? med.category : (med.category as any)?.name || '',
      composition: med.composition,
      manufacturer: med.manufacturer,
      price: String(med.price),
      discountPrice: String(med.discountPrice || ''),
      stock: String(med.stock),
      expiryDate: med.expiryDate?.split('T')[0] || '',
      batchNumber: med.batchNumber,
      description: med.description,
      prescriptionRequired: med.prescriptionRequired,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.price || !form.stock) {
      toast.error('Please fill all required fields'); return;
    }
    saveMutation.mutate({
      ...form,
      price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
      stock: parseInt(form.stock),
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: 'Sora', fontWeight: 800 }}>Medicines</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Manage your medicine catalog</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditId(null); setForm(EMPTY_FORM); setDialogOpen(true); }}>
          Add Medicine
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, border: '1px solid #E8ECF0' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #E8ECF0' }}>
          <TextField
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            size="small"
            sx={{ width: 320 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#FAFBFC' }}>
                    {['Medicine Name', 'Category', 'Price', 'Stock', 'Expiry', 'Rx', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: 13, color: 'text.secondary' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicines.length === 0 ? (
                    <TableRow><TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>No medicines found</TableCell></TableRow>
                  ) : medicines.map((med) => (
                    <TableRow key={med._id} sx={{ '&:hover': { bgcolor: '#FAFBFC' } }}>
                      <TableCell>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{med.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{med.manufacturer}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={typeof med.category === 'string' ? med.category : (med.category as any)?.name} size="small" sx={{ bgcolor: '#F0FBF8', color: 'primary.main', fontSize: 11 }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>₹{med.price}</Typography>
                        {med.discountPrice && <Typography sx={{ fontSize: 11, color: 'text.secondary', textDecoration: 'line-through' }}>₹{med.discountPrice}</Typography>}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={med.stock > 10 ? `${med.stock} units` : med.stock > 0 ? `⚠ ${med.stock} left` : 'Out of Stock'}
                          size="small"
                          sx={{
                            bgcolor: med.stock > 10 ? '#E8F5E9' : med.stock > 0 ? '#FFF8E1' : '#FFEBEE',
                            color: med.stock > 10 ? '#2E7D32' : med.stock > 0 ? '#F57F17' : '#B71C1C',
                            fontWeight: 600, fontSize: 11,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{new Date(med.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</TableCell>
                      <TableCell>
                        {med.prescriptionRequired
                          ? <Chip label="Rx" size="small" sx={{ bgcolor: '#FFEBEE', color: '#B71C1C', fontWeight: 700, fontSize: 10 }} />
                          : <Chip label="OTC" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: 10 }} />}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => handleEdit(med)} sx={{ mr: 0.5 }}>
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteDialog(med._id)}>
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: 'Sora', fontWeight: 700 }}>{editId ? 'Edit Medicine' : 'Add New Medicine'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}><TextField label="Medicine Name *" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category *</InputLabel>
                <Select label="Category *" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField label="Composition / Salt" fullWidth value={form.composition} onChange={(e) => setForm({ ...form, composition: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Manufacturer" fullWidth value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="MRP Price (₹) *" type="number" fullWidth value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Discount Price (₹)" type="number" fullWidth value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} /></Grid>
            <Grid item xs={12} sm={4}><TextField label="Stock Quantity *" type="number" fullWidth value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Batch Number" fullWidth value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Expiry Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField label="Description" fullWidth multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={form.prescriptionRequired} onChange={(e) => setForm({ ...form, prescriptionRequired: e.target.checked })} color="primary" />}
                label="Prescription Required (Rx)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : editId ? 'Update Medicine' : 'Add Medicine'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={Boolean(deleteDialog)} onClose={() => setDeleteDialog(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Medicine?</DialogTitle>
        <DialogContent><Typography>This action cannot be undone. The medicine will be permanently deleted.</Typography></DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialog(null)} variant="outlined">Cancel</Button>
          <Button onClick={() => deleteMutation.mutate(deleteDialog!)} variant="contained" color="error" disabled={deleteMutation.isPending}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMedicinesPage;

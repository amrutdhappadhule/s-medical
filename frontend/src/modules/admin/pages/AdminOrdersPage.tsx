import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { Order } from '../../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  placed: { label: 'Placed', color: '#1565C0', bg: '#E3F2FD' },
  preparing: { label: 'Preparing', color: '#F57F17', bg: '#FFF8E1' },
  ready: { label: 'Ready', color: '#6A1B9A', bg: '#F3E5F5' },
  delivered: { label: 'Delivered', color: '#2E7D32', bg: '#E8F5E9' },
  cancelled: { label: 'Cancelled', color: '#B71C1C', bg: '#FFEBEE' },
};

const ORDER_STATUSES = ['placed', 'preparing', 'ready', 'delivered', 'cancelled'];

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', search, statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '10', ...(search && { search }), ...(statusFilter !== 'all' && { status: statusFilter }) });
      const res = await api.get(`/orders?${params}`);
      return res as any;
    },
  });

  const orders = (data as any)?.orders || [];
  const totalPages = data?.totalPages || 1;

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.put(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      if (selectedOrder) setSelectedOrder(prev => prev ? { ...prev, orderStatus: prev.orderStatus } : null);
    },
    onError: () => toast.error('Failed to update status'),
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Sora', fontWeight: 800 }}>Orders</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>Manage and track all customer orders</Typography>
      </Box>

      <Paper sx={{ borderRadius: 3, border: '1px solid #E8ECF0' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #E8ECF0', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <MenuItem value="all">All Status</MenuItem>
              {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#FAFBFC' }}>
                    {['Order ID', 'Customer', 'Items', 'Total', 'Delivery', 'Payment', 'Status', 'Date', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: 13, color: 'text.secondary' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow><TableCell colSpan={9} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>No orders found</TableCell></TableRow>
                  ) : orders.map((order) => {
                    const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
                    return (
                      <TableRow key={order._id} sx={{ '&:hover': { bgcolor: '#FAFBFC' }, cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                        <TableCell sx={{ fontSize: 13, fontWeight: 700, color: 'primary.main' }}>#{order._id.slice(-8).toUpperCase()}</TableCell>
                        <TableCell sx={{ fontSize: 13 }}>{(order.user as any)?.name || 'N/A'}</TableCell>
                        <TableCell sx={{ fontSize: 13 }}>{order.items?.length || 0} items</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>₹{order.totalAmount?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip label={order.deliveryType === 'home' ? '🚚 Home' : '🏪 Pickup'} size="small" sx={{ fontSize: 11 }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, textTransform: 'capitalize' }}>{order.paymentMethod}</TableCell>
                        <TableCell>
                          <Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: 11 }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>
                          {order.createdAt ? format(new Date(order.createdAt), 'dd MMM') : ''}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <FormControl size="small" sx={{ minWidth: 110 }}>
                            <Select value={order.orderStatus} onChange={(e) => updateStatusMutation.mutate({ id: order._id, status: e.target.value })}
                              sx={{ fontSize: 12 }}>
                              {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ fontSize: 12, textTransform: 'capitalize' }}>{s}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      {/* Order Detail Dialog */}
      <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Sora' }}>
              Order #{selectedOrder._id.slice(-8).toUpperCase()}
            </DialogTitle>
            <DialogContent dividers>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 2 }}>
                Placed on {format(new Date(selectedOrder.createdAt), 'dd MMM yyyy, hh:mm a')}
              </Typography>
              {selectedOrder.items?.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: 14 }}>{item.medicine?.name || 'Medicine'} × {item.quantity}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E8ECF0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography fontWeight={700}>Total</Typography>
                  <Typography fontWeight={800} color="primary">₹{selectedOrder.totalAmount?.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Delivery</Typography>
                  <Typography sx={{ fontSize: 13 }}>{selectedOrder.deliveryType === 'home' ? 'Home Delivery' : 'Store Pickup'}</Typography>
                </Box>
                {selectedOrder.deliveryAddress && (
                  <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 1 }}>
                    Address: {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pincode}
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedOrder(null)} variant="outlined">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminOrdersPage;

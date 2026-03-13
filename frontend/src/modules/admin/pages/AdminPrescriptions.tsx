import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Avatar, Tooltip, CircularProgress
} from '@mui/material'
import { Check, Close, Visibility, Refresh } from '@mui/icons-material'
import toast from 'react-hot-toast'
import api from '../../../services/api'

const statusColors: Record<string, any> = {
  pending: 'warning', approved: 'success', rejected: 'error'
}

export default function AdminPrescriptions() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedPx, setSelectedPx] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-prescriptions', statusFilter],
    queryFn: () => api.get(`/prescriptions${statusFilter ? `?status=${statusFilter}` : ''}`),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }: any) =>
      api.put(`/prescriptions/${id}/status`, { status, rejectionReason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-prescriptions'] })
      toast.success('Prescription updated')
      setSelectedPx(null)
    },
    onError: (e: any) => toast.error(e.message),
  })

  const prescriptions = (data as any)?.prescriptions || []

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Prescription Management</Typography>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select value={statusFilter} label="Filter Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell fontWeight={600}>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.map((px: any) => (
                <TableRow key={px._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>
                        {px.user?.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{px.user?.name || 'Unknown'}</Typography>
                        <Typography variant="caption" color="text.secondary">{px.user?.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2">{px.doctorName || 'N/A'}</Typography></TableCell>
                  <TableCell>
                    <Typography variant="body2">{new Date(px.createdAt).toLocaleDateString('en-IN')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={px.status} color={statusColors[px.status]} size="small" sx={{ fontWeight: 600, textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => setSelectedPx(px)}><Visibility fontSize="small" /></IconButton>
                    </Tooltip>
                    {px.status === 'pending' && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton size="small" color="success" onClick={() => updateMutation.mutate({ id: px._id, status: 'approved' })}>
                            <Check fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton size="small" color="error" onClick={() => { setSelectedPx(px); setRejectReason('') }}>
                            <Close fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={Boolean(selectedPx)} onClose={() => setSelectedPx(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent>
          {selectedPx && (
            <Box>
              <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
                <Typography variant="body2"><strong>Patient:</strong> {selectedPx.user?.name}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {selectedPx.user?.email}</Typography>
                <Typography variant="body2"><strong>Doctor:</strong> {selectedPx.doctorName || 'Not specified'}</Typography>
                <Typography variant="body2"><strong>Notes:</strong> {selectedPx.notes || 'None'}</Typography>
              </Box>
              {selectedPx.imageUrl && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img src={selectedPx.imageUrl} alt="Prescription" style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, border: '1px solid #e0e0e0' }} />
                </Box>
              )}
              {selectedPx.status === 'pending' && (
                <TextField
                  fullWidth
                  label="Rejection Reason (optional)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  multiline rows={2} size="small"
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPx(null)}>Close</Button>
          {selectedPx?.status === 'pending' && (
            <>
              <Button color="error" variant="outlined" onClick={() => updateMutation.mutate({ id: selectedPx._id, status: 'rejected', rejectionReason: rejectReason })}>
                Reject
              </Button>
              <Button color="success" variant="contained" onClick={() => updateMutation.mutate({ id: selectedPx._id, status: 'approved' })}>
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

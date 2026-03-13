import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import { Prescription } from '../../../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { label: 'Under Review', color: '#F57F17', bg: '#FFF8E1', icon: <PendingIcon sx={{ fontSize: 16 }} /> },
  approved: { label: 'Approved', color: '#2E7D32', bg: '#E8F5E9', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  rejected: { label: 'Rejected', color: '#B71C1C', bg: '#FFEBEE', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
};

const PrescriptionPage = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: prescriptions, isLoading } = useQuery<Prescription[]>({
    queryKey: ['my-prescriptions'],
    queryFn: async () => {
      const res = await api.get('/prescriptions');
      return res as any;
    },
  });

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'], 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('prescription', file);
      await api.post('/prescriptions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Prescription uploaded successfully!');
      setFile(null);
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: ['my-prescriptions'] });
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>My Prescriptions</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>Upload your doctor's prescription and we'll prepare your order</Typography>

      {/* Upload area */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #E8ECF0' }}>
        <Typography fontWeight={700} sx={{ mb: 2.5 }}>Upload New Prescription</Typography>

        <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
          Accepted formats: JPG, PNG, PDF. Max size: 5MB. Your prescription will be reviewed by our pharmacist within 30 minutes.
        </Alert>

        {!file ? (
          <Box
            {...getRootProps()}
            sx={{
              border: `2px dashed ${isDragActive ? '#00856F' : '#C8D6DF'}`,
              borderRadius: 3, p: 5, textAlign: 'center', cursor: 'pointer',
              bgcolor: isDragActive ? '#F0FBF8' : '#FAFBFC',
              transition: 'all 0.2s',
              '&:hover': { borderColor: '#00856F', bgcolor: '#F0FBF8' },
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: '#00856F', opacity: 0.5, mb: 1.5 }} />
            <Typography fontWeight={600} sx={{ mb: 0.5 }}>
              {isDragActive ? 'Drop your prescription here' : 'Drag & drop your prescription'}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2, fontSize: 14 }}>or click to browse files</Typography>
            <Button variant="outlined" size="small">Choose File</Button>
          </Box>
        ) : (
          <Box>
            <Box sx={{ bgcolor: '#F0FBF8', borderRadius: 2, p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {preview && file.type.startsWith('image/') ? (
                <Box component="img" src={preview} sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1.5 }} />
              ) : (
                <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700} sx={{ fontSize: 14 }}>{file.name}</Typography>
                <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</Typography>
              </Box>
              <Button size="small" color="error" onClick={() => { setFile(null); setPreview(null); }}>Remove</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleUpload} disabled={uploading} size="large">
                {uploading ? <><CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />Uploading...</> : 'Upload Prescription'}
              </Button>
              <Button variant="outlined" onClick={() => { setFile(null); setPreview(null); }}>Cancel</Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* History */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Upload History</Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : !prescriptions || prescriptions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid #E8ECF0' }}>
          <DescriptionIcon sx={{ fontSize: 48, color: '#E8ECF0', mb: 1 }} />
          <Typography color="text.secondary">No prescriptions uploaded yet</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {prescriptions.map((p) => {
            const s = STATUS_CONFIG[p.status];
            return (
              <Paper key={p._id} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E8ECF0', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box component="img" src={p.imageUrl} alt="Prescription"
                  sx={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 2, flexShrink: 0, bgcolor: '#F5F7FA' }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700} sx={{ fontSize: 14 }}>Prescription #{p._id.slice(-6).toUpperCase()}</Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    Uploaded on {format(new Date(p.uploadedAt), 'dd MMM yyyy, hh:mm a')}
                  </Typography>
                  {p.notes && <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>Note: {p.notes}</Typography>}
                </Box>
                <Chip label={s.label} icon={s.icon}
                  sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, '& .MuiChip-icon': { color: s.color } }}
                />
              </Paper>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default PrescriptionPage;

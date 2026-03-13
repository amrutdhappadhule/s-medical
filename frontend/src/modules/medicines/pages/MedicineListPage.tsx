import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useQuery } from '@tanstack/react-query';
import MedicineCard from '../../../components/common/MedicineCard';
import api from '../../../services/api';
import { Medicine } from '../../../types';

const CATEGORIES = ['All', 'Tablets', 'Syrups', 'Vitamins', 'Injections', 'Medical Devices', 'Skincare', 'Baby Care', 'Eye Drops'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

const MedicineListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    sort: 'popular',
    priceRange: [0, 2000] as [number, number],
    prescriptionOnly: false,
    inStock: false,
    page: 1,
  });

  // Sync search param from URL
  useEffect(() => {
    const s = searchParams.get('search');
    const c = searchParams.get('category');
    if (s) setFilters(prev => ({ ...prev, search: s, page: 1 }));
    if (c) setFilters(prev => ({ ...prev, category: c, page: 1 }));
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['medicines', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(filters.page),
        limit: '12',
        sort: filters.sort,
        ...(filters.search && { search: filters.search }),
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.inStock && { inStock: 'true' }),
        ...(filters.prescriptionOnly && { prescriptionRequired: 'true' }),
        minPrice: String(filters.priceRange[0]),
        maxPrice: String(filters.priceRange[1]),
      });
      const res = await api.get(`/medicines?${params}`);
      return res as any;
    },
  });

  const medicines: Medicine[] = (data as any)?.medicines || [];
  const totalPages = (data as any)?.pagination?.totalPages || 1;
  const total = (data as any)?.pagination?.total || 0;

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const FilterPanel = () => (
    <Box sx={{ p: isMobile ? 2 : 0 }}>
      {isMobile && (
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Filters</Typography>
      )}

      {/* Categories */}
      <Typography fontWeight={700} sx={{ mb: 1.5, fontSize: 14 }}>Categories</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
        {CATEGORIES.map((cat) => (
          <Box
            key={cat}
            onClick={() => updateFilter('category', cat)}
            sx={{
              px: 1.5, py: 0.8, borderRadius: 2, cursor: 'pointer', fontSize: 14,
              fontWeight: filters.category === cat ? 700 : 400,
              bgcolor: filters.category === cat ? '#F0FBF8' : 'transparent',
              color: filters.category === cat ? 'primary.main' : 'text.primary',
              borderLeft: filters.category === cat ? '3px solid #00856F' : '3px solid transparent',
              '&:hover': { bgcolor: '#F5F7FA' },
              transition: 'all 0.15s',
            }}
          >
            {cat}
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Price range */}
      <Typography fontWeight={700} sx={{ mb: 2, fontSize: 14 }}>Price Range</Typography>
      <Box sx={{ px: 1, mb: 3 }}>
        <Slider
          value={filters.priceRange}
          onChange={(_, v) => updateFilter('priceRange', v as [number, number])}
          min={0} max={2000} step={50}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `₹${v}`}
          color="primary"
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">₹{filters.priceRange[0]}</Typography>
          <Typography variant="caption" color="text.secondary">₹{filters.priceRange[1]}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Checkboxes */}
      <Typography fontWeight={700} sx={{ mb: 1, fontSize: 14 }}>Availability</Typography>
      <FormControlLabel
        control={<Checkbox checked={filters.inStock} onChange={(e) => updateFilter('inStock', e.target.checked)} color="primary" size="small" />}
        label={<Typography sx={{ fontSize: 14 }}>In Stock Only</Typography>}
      />
      <FormControlLabel
        control={<Checkbox checked={filters.prescriptionOnly} onChange={(e) => updateFilter('prescriptionOnly', e.target.checked)} color="primary" size="small" />}
        label={<Typography sx={{ fontSize: 14 }}>Prescription Required</Typography>}
      />

      {isMobile && (
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => setFilterDrawerOpen(false)}>
          Apply Filters
        </Button>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
          {filters.category !== 'All' ? filters.category : 'All Medicines'}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          {total > 0 ? `${total} medicines found` : 'Browse our complete medicine catalog'}
        </Typography>
      </Box>

      {/* Search + Sort bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search medicines..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
          sx={{ flex: 1, minWidth: 200 }}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={filters.sort} label="Sort By" onChange={(e) => updateFilter('sort', e.target.value)}>
            {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </Select>
        </FormControl>
        {isMobile && (
          <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFilterDrawerOpen(true)}>
            Filters
          </Button>
        )}
      </Box>

      {/* Active filters chips */}
      {(filters.category !== 'All' || filters.search || filters.inStock || filters.prescriptionOnly) && (
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {filters.category !== 'All' && (
            <Chip label={filters.category} onDelete={() => updateFilter('category', 'All')} color="primary" variant="outlined" size="small" />
          )}
          {filters.search && (
            <Chip label={`Search: ${filters.search}`} onDelete={() => updateFilter('search', '')} color="primary" variant="outlined" size="small" />
          )}
          {filters.inStock && <Chip label="In Stock" onDelete={() => updateFilter('inStock', false)} size="small" />}
          {filters.prescriptionOnly && <Chip label="Prescription Required" onDelete={() => updateFilter('prescriptionOnly', false)} size="small" />}
          <Chip
            label="Clear All"
            onClick={() => setFilters(prev => ({ ...prev, search: '', category: 'All', inStock: false, prescriptionOnly: false, priceRange: [0, 2000], page: 1 }))}
            sx={{ bgcolor: '#FFEBEE', color: '#B71C1C', cursor: 'pointer' }}
            size="small"
          />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Sidebar – desktop */}
        {!isMobile && (
          <Grid item md={2.5}>
            <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 2.5, border: '1px solid #E8ECF0', position: 'sticky', top: 100 }}>
              <FilterPanel />
            </Box>
          </Grid>
        )}

        {/* Medicine grid */}
        <Grid item xs={12} md={9.5}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : medicines.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: 48, mb: 2 }}>🔍</Typography>
              <Typography variant="h6" fontWeight={700}>No medicines found</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>Try adjusting your search or filters</Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {medicines.map((med) => (
                  <Grid item xs={6} sm={4} lg={3} key={med._id}>
                    <MedicineCard medicine={med} />
                  </Grid>
                ))}
              </Grid>
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination count={totalPages} page={filters.page} onChange={(_, p) => setFilters(prev => ({ ...prev, page: p }))} color="primary" shape="rounded" />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile filter drawer */}
      <Drawer anchor="left" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <Box sx={{ width: 280, mt: 1 }}><FilterPanel /></Box>
      </Drawer>
    </Container>
  );
};

export default MedicineListPage;

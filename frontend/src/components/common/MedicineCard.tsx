// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import MedicationIcon from '@mui/icons-material/Medication';
// import { Medicine } from '../../types';
// import { useCart } from '../../hooks/useCart';

// interface MedicineCardProps {
//   medicine: Medicine;
//   compact?: boolean;
// }

// const MedicineCard = ({ medicine, compact }: MedicineCardProps) => {
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const category = typeof medicine.category === 'string' ? medicine.category : medicine.category?.name;
//   const discount = medicine.discountPrice
//     ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100)
//     : 0;

//   return (
//     <Card
//       sx={{
//         height: '100%', display: 'flex', flexDirection: 'column',
//         cursor: 'pointer', position: 'relative', overflow: 'visible',
//         border: '1px solid #F0F4F8',
//       }}
//       onClick={() => navigate(`/medicines/${medicine._id}`)}
//     >
//       {/* Discount badge */}
//       {discount > 0 && (
//         <Box sx={{
//           position: 'absolute', top: -8, left: 12, zIndex: 1,
//           bgcolor: '#FF6B35', color: 'white', borderRadius: 1.5,
//           px: 1, py: 0.3, fontSize: 11, fontWeight: 700,
//         }}>
//           {discount}% OFF
//         </Box>
//       )}

//       {/* Rx badge */}
//       {medicine.prescriptionRequired && (
//         <Box sx={{
//           position: 'absolute', top: 8, right: 8, zIndex: 1,
//           bgcolor: '#E53935', color: 'white', borderRadius: 1,
//           px: 0.8, py: 0.2, fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
//         }}>
//           Rx
//         </Box>
//       )}

//       {/* Image */}
//       {medicine.imageUrl ? (
//         <CardMedia component="img" height={compact ? 100 : 130}
//           image={medicine.imageUrl} alt={medicine.name}
//           sx={{ objectFit: 'contain', p: 1, bgcolor: '#F8FFFE' }}
//         />
//       ) : (
//         <Box sx={{
//           height: compact ? 100 : 130, bgcolor: '#F0FBF8',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }}>
//           <MedicationIcon sx={{ fontSize: 48, color: '#00856F', opacity: 0.3 }} />
//         </Box>
//       )}

//       <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: compact ? 1.5 : 2 }}>
//         <Chip label={category} size="small"
//           sx={{ alignSelf: 'flex-start', mb: 0.8, bgcolor: '#F0FBF8', color: '#00856F', fontWeight: 500, fontSize: 11, height: 20 }}
//         />
//         <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.4, lineHeight: 1.3, fontSize: compact ? 13 : 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
//           {medicine.name}
//         </Typography>
//         {!compact && (
//           <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: 11, noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//             {medicine.manufacturer}
//           </Typography>
//         )}
//         {medicine.composition && (
//           <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//             {medicine.composition}
//           </Typography>
//         )}

//         <Box sx={{ mt: 'auto' }}>
//           {/* Price */}
//           <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8, mb: 1 }}>
//             <Typography variant="h6" fontWeight={800} color="primary" sx={{ fontSize: compact ? 15 : 17 }}>
//               ₹{(medicine.discountPrice || medicine.price).toFixed(2)}
//             </Typography>
//             {discount > 0 && (
//               <Typography sx={{ textDecoration: 'line-through', fontSize: 12, color: 'text.secondary' }}>
//                 ₹{medicine.price.toFixed(2)}
//               </Typography>
//             )}
//           </Box>

//           {/* Stock */}
//           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
//             <Chip
//               label={medicine.stock > 10 ? 'In Stock' : medicine.stock > 0 ? `Only ${medicine.stock} left` : 'Out of Stock'}
//               size="small"
//               sx={{
//                 bgcolor: medicine.stock > 10 ? '#E8F5E9' : medicine.stock > 0 ? '#FFF8E1' : '#FFEBEE',
//                 color: medicine.stock > 10 ? '#2E7D32' : medicine.stock > 0 ? '#F57F17' : '#B71C1C',
//                 fontWeight: 600, fontSize: 10, height: 20,
//               }}
//             />
//             {medicine.stock > 0 && (
//               <Tooltip title={medicine.prescriptionRequired ? 'Prescription required' : 'Add to cart'}>
//                 <span>
//                   <IconButton
//                     size="small"
//                     color="primary"
//                     onClick={(e) => { e.stopPropagation(); addToCart(medicine); }}
//                     sx={{ bgcolor: '#F0FBF8', '&:hover': { bgcolor: 'primary.main', color: 'white' }, transition: 'all 0.2s' }}
//                   >
//                     <AddShoppingCartIcon sx={{ fontSize: 18 }} />
//                   </IconButton>
//                 </span>
//               </Tooltip>
//             )}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default MedicineCard;










import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MedicationIcon from '@mui/icons-material/Medication';
import { Medicine } from '../../types';
import { useCart } from '../../hooks/useCart';

interface MedicineCardProps {
  medicine: Medicine;
  compact?: boolean;
}

const MedicineCard = ({ medicine, compact }: MedicineCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const category =
    typeof medicine.category === 'string'
      ? medicine.category
      : medicine.category?.name;

  const discount = medicine.discountPrice
    ? Math.round(
        ((medicine.price - medicine.discountPrice) / medicine.price) * 100
      )
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        border: '1px solid #EEF2F6',
        borderRadius: 3,
        transition: 'all 0.25s ease',
        // background: '#fff',
        background: '#c0ffcc',


        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 14px 28px rgba(0,0,0,0.08)',
        },
      }}
      onClick={() => navigate(`/medicines/${medicine._id}`)}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            left: 12,
            zIndex: 2,
            bgcolor: '#FF6B35',
            color: 'white',
            borderRadius: 1.5,
            px: 1,
            py: 0.3,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {discount}% OFF
        </Box>
      )}

      {/* Prescription Badge */}
      {medicine.prescriptionRequired && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: '#E53935',
            color: 'white',
            borderRadius: 1,
            px: 0.8,
            py: 0.2,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Rx
        </Box>
      )}

      {/* Image Section */}
      <Box
        sx={{
          height: compact ? 110 : 140,
          bgcolor: '#c0ffcc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1.5,
        }}
      >
        {medicine.imageUrl ? (
          <Box
            component="img"
            src={medicine.imageUrl}
            alt={medicine.name}
            sx={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <MedicationIcon sx={{ fontSize: 48, color: '#B0BEC5' }} />
        )}
      </Box>

      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: compact ? 1.5 : 2,
        }}
      >
        {/* Category */}
        <Chip
          label={category}
          size="small"
          sx={{
            alignSelf: 'flex-start',
            mb: 0.8,
            bgcolor: '#ECFDF5',
            color: '#047857',
            fontWeight: 600,
            fontSize: 11,
            height: 22,
          }}
        />

        {/* Medicine Name */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            mb: 0.4,
            lineHeight: 1.3,
            fontSize: compact ? 13 : 14,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {medicine.name}
        </Typography>

        {/* Manufacturer */}
        {!compact && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mb: 0.5,
              fontSize: 11,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {medicine.manufacturer}
          </Typography>
        )}

        {/* Composition */}
        {medicine.composition && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mb: 1,
              fontSize: 11,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {medicine.composition}
          </Typography>
        )}

        <Box sx={{ mt: 'auto' }}>
          {/* Price Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#059669',
                fontSize: compact ? 15 : 18,
              }}
            >
              ₹{(medicine.discountPrice || medicine.price).toFixed(2)}
            </Typography>

            {discount > 0 && (
              <Typography
                sx={{
                  textDecoration: 'line-through',
                  color: '#9CA3AF',
                  fontSize: 13,
                }}
              >
                ₹{medicine.price.toFixed(2)}
              </Typography>
            )}
          </Box>

          {/* Stock + Cart */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Chip
              label={
                medicine.stock > 10
                  ? 'In Stock'
                  : medicine.stock > 0
                  ? `Only ${medicine.stock} left`
                  : 'Out of Stock'
              }
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: 11,
                height: 22,
                bgcolor:
                  medicine.stock > 10
                    ? '#E8F5E9'
                    : medicine.stock > 0
                    ? '#FFF8E1'
                    : '#FFEBEE',
                color:
                  medicine.stock > 10
                    ? '#2E7D32'
                    : medicine.stock > 0
                    ? '#F57F17'
                    : '#B71C1C',
              }}
            />

            {medicine.stock > 0 && (
              <Tooltip
                title={
                  medicine.prescriptionRequired
                    ? 'Prescription required'
                    : 'Add to cart'
                }
              >
                <span>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(medicine);
                    }}
                    sx={{
                      bgcolor: '#ECFDF5',
                      color: '#059669',
                      '&:hover': {
                        bgcolor: '#059669',
                        color: 'white',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <AddShoppingCartIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MedicineCard;
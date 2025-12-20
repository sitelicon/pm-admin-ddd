import { Box, CircularProgress } from '@mui/material';
import { Logo } from './logo';

export const SplashScreen = () => (
  <Box
    sx={{
      alignItems: 'center',
      backgroundColor: '#ffffff',
      backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      justifyContent: 'center',
      left: 0,
      p: 3,
      position: 'fixed',
      top: 0,
      width: '100vw',
      zIndex: 1400,
    }}
  >
    <Box sx={{ display: 'inline-flex', height: 48, width: 460 }}>
      <Logo />
    </Box>
    <CircularProgress
      size={24}
      thickness={5}
      sx={{
        mt: 4,
        color: '#000000',
      }}
    />
  </Box>
);

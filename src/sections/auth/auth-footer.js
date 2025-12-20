import { Box, Link, Typography, Stack } from '@mui/material';
import NextLink from 'next/link';
import { paths } from '../../paths';

export const AuthFooter = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        border: '1px dashed #d1d5db',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography
          variant="caption"
          sx={{
            fontFamily: "'JetBrains Mono', monospace",
            color: '#9ca3af',
            fontWeight: 700,
          }}
        >
          [ACCESS_ISSUE]:
        </Typography>

        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          ¿No recuerdas tu contraseña?{' '}
          <Link
            component={NextLink}
            href={paths.auth.forgotPassword}
            underline="hover"
            sx={{
              color: '#000000',
              fontWeight: 700,
              '&:hover': {
                color: '#374151',
              },
            }}
          >
            Solicita una nueva
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
};

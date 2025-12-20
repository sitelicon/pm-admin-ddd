import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Logo } from '../../components/logo';
import { paths } from '../../paths';

const LayoutRoot = styled('div')(() => ({
  backgroundColor: '#ffffff',
  backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
  backgroundSize: '24px 24px',
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  height: '100%',
  fontFamily: "'Inter', sans-serif",
}));

export const Layout = (props) => {
  const { children } = props;

  return (
    <LayoutRoot>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          flex: '1 1 auto',
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '120px',
            },
          }}
        >
          <Stack direction="row" justifyContent="center" mb={6}>
            <Stack
              alignItems="center"
              justifyContent="center"
              component={NextLink}
              direction="row"
              display="inline-flex"
              href={paths.index}
              sx={{ textDecoration: 'none' }}
            >
              <Box sx={{ height: 40, width: 'auto', color: 'white' }}>
                <Logo />
              </Box>
            </Stack>
          </Stack>
          {children}
        </Container>
      </Box>
    </LayoutRoot>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

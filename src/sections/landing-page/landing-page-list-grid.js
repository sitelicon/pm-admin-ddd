import { useEffect, useState } from 'react';
import { Box, Link, Grid, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Scrollbar } from '../../components/scrollbar';
import { LandingPageDeleteConfirmModal } from './landing-page-delete-confirm-modal';
import { useSelectionModel } from '../../hooks/use-selection-model';
import { landingPageApi } from '../../api/landing-page';
import NextLink from 'next/link';
import { LandingPageCard } from './landing-page-card';

export const LandingPageListGrid = (props) => {
  const { landingPages, handleRemove, ...other } = props;
  const { selected } = useSelectionModel(landingPages);
  const [open, setOpen] = useState(false);
  const [detailedLandingPages, setDetailedLandingPages] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carga
  const editable = false;

  // Función para obtener los datos completos de cada landing page
  const fetchLandingPageDetails = async () => {
    setLoading(true); // Inicia el estado de carga
    try {
      const detailedPages = await Promise.all(
        landingPages.map(async (landingPage) => {
          const components = await landingPageApi.getLandingPage(
            landingPage.id,
          );
          return {
            ...landingPage,
            ...components, // Añadir header, boxes, y carrousel al objeto de la landing page
          };
        }),
      );
      setDetailedLandingPages(detailedPages); // Guardar las landing pages detalladas
    } catch (error) {
      console.error('Error fetching landing pages:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Cargar los detalles de las landing pages cuando cambien
  useEffect(() => {
    if (landingPages.length > 0) {
      fetchLandingPageDetails();
    } else {
      setDetailedLandingPages([]); // Limpiar el estado si no hay landing pages
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingPages]);

  const removeSelected = () => {
    handleRemove(selected);
  };

  const closeDeleteModal = () => {
    setOpen(false);
  };

  const openDeleteModal = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ position: 'relative' }} {...other}>
      <Scrollbar>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              mt: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {detailedLandingPages.length > 0
              ? detailedLandingPages.map((landingPage) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={landingPage.id}
                    sx={{
                      backgroundColor:
                        landingPage.active === 0
                          ? 'rgba(240, 68, 56, 0.12)'
                          : 'transparent',
                      padding: '16px', // Puedes ajustar el padding según sea necesario
                      margin: '5px',
                      borderRadius: '8px', // Opcional: para esquinas redondeadas
                      transition: 'background-color 0.3s ease', // Transición suave para el cambio de color
                    }}
                  >
                    <Link
                      component={NextLink}
                      href={`/landing-page/${landingPage.id}`}
                      sx={{ textDecoration: 'none' }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ margin: 2 }}
                      >
                        {landingPage.title}
                      </Typography>
                      <LandingPageCard landingPage={landingPage} />
                    </Link>
                  </Grid>
                ))
              : landingPages.map((landingPage) => (
                  <Grid item xs={12} sm={6} md={4} key={landingPage.id}>
                    <LandingPageCard
                      landingPage={landingPage}
                      editable={editable}
                    />
                  </Grid>
                ))}
          </Grid>
        )}
      </Scrollbar>

      <LandingPageDeleteConfirmModal
        open={open}
        onClose={closeDeleteModal}
        onConfirm={removeSelected}
      />
    </Box>
  );
};

LandingPageListGrid.propTypes = {
  landingPages: PropTypes.array.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

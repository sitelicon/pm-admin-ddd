import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { format } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers';
import { notFound } from 'next/navigation';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Tooltip,
  IconButton,
  SvgIcon,
  Collapse,
  useMediaQuery,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ChevronDown, Download02 } from '@untitled-ui/icons-react';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { ChevronRight } from '@mui/icons-material';
import { landingPageApi } from '../../api/landing-page';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { es } from 'date-fns/locale';
import { LandingPageCard } from '../../sections/landing-page/landing-page-card';

import { useStores } from '../../hooks/use-stores';
import { LandingCreateComponentModal } from '../../sections/landing-page/landing-component-create-modal';
import { LandingPageDeleteConfirmModal } from '../../sections/landing-page/landing-page-delete-confirm-modal';
import { getURL } from 'next/dist/shared/lib/utils';

const useLandingPage = (landingPageId) => {
  const isMounted = useMounted();
  const [landingPage, setLandingPage] = useState();
  const [error, setError] = useState(undefined);

  const getLandingPage = useCallback(
    async (id) => {
      try {
        const response = await landingPageApi.getLandingPage(landingPageId);

        if (isMounted()) {
          setLandingPage(response);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted],
  );

  useEffect(() => {
    getLandingPage(landingPageId);
  }, [landingPageId, getLandingPage]);

  return { landingPage, error, refetch: getLandingPage };
};

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const router = useRouter();
  const { id } = router.query;
  const stores = useStores();
  const { landingPage, error, refetch } = useLandingPage(id);

  const [openDialog, setOpenDialog] = useState(false);
  const [componentType, setComponentType] = useState('');
  const [open, setOpen] = useState(false);
  const editable = true;
  const [dataOpen, setDataOpen] = useState(true);
  const [updatedLandingPage, setLandigData] = useState(null);

  const [editIsActive, setIsActive] = useState(true);
  const [editTitle, setEditedTitle] = useState(null);
  const [editUrl, setEditedURL] = useState(landingPage?.url);
  const [editFrom, setEditedFrom] = useState(null);
  const [editTo, setEditedTo] = useState(null);
  const [editTienda, setEditedTienda] = useState(landingPage?.store_id);

  usePageView();

  const handleOpenDialog = (type) => {
    setComponentType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setComponentType(''); // Resetea el tipo de componente
  };

  const handleSwitchChange = (event, checked) => {
    setLandingPage((prev) => ({
      ...prev,
      active: checked,
    }));
    setIsActive(checked);
  };

  const handleUrl = (dato) => {
    setLandingPage((prev) => ({
      ...prev,
      url: dato,
    }));
    setEditedURL(dato);
  };

  const handleTitle = (dato) => {
    setLandingPage((prev) => ({
      ...prev,
      title: dato,
    }));
    setEditedTitle(dato);
  };

  const handleStore = (dato) => {
    setLandingPage((prev) => ({
      ...prev,
      store_id: dato,
    }));
    setEditedTienda(dato);
  };

  const guardarDataLanding = async () => {
    try {
      const updateData = {
        active: editIsActive ? 1 : 0,
        title: editTitle ? editTitle : landingPage.title,
        url: editUrl ? editUrl : landingPage.url,
        from: editFrom ? editFrom : landingPage.from,
        to: editTo ? editTo : landingPage.to,
        store_id: editTienda ? editTienda : landingPage.store_id,
      };
      const response = await landingPageApi.updateLandingPage(id, updateData);
      toast.success('Landing Page modificada correctamente.');
      refetch();
    } catch (error) {
      console.error(error);
      //toast.error('Error al modificar la Landing Page.');
    }
  };

  const handleAddComponent = async (newComponent) => {
    try {
      newComponent.order = landingPage.relatedItems.length + 1;
      // Dependiendo del tipo de componente, hacer la llamada correspondiente a la API
      if (newComponent.type === 'header') {
        await landingPageApi.createHeaderLandingPage(id, newComponent);
      } else if (newComponent.type === 'box') {
        await landingPageApi.createBoxLandingPage(id, newComponent);
      } else if (newComponent.type === 'carrousel') {
        await landingPageApi.createCarrouselLandingPage(id, newComponent);
      }

      toast.success('Componente agregado exitosamente');
      refetch();

      // Cerrar el diálogo
      handleCloseDialog();
      return { landingPage };
    } catch (error) {
      console.error('Error al agregar componente:', error);
      toast.error('Problema al agregar componente ' + error);
    }
  };

  if (!landingPage) {
    return null;
  }

  const createdAt = format(
    new Date(landingPage.created_at),
    'dd/MM/yyyy HH:mm',
    { locale: es },
  );

  const removeSelected = () => {};

  const closeDeleteModal = () => {
    setOpen(false);
  };

  const openDeleteModal = () => {
    setOpen(true);
  };

  const align = mdUp ? 'horizontal' : 'vertical';
  if (error || !landingPage) {
    return notFound();
  }

  return (
    <>
      <Head>
        <title>
          Landing Web #{landingPage.landingId} ({landingPage.title}) |
          PACOMARTINEZ
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="md">
          <Card>
            <CardHeader
              title="Editar Landing Page"
              subheader="Ajusta los datos: título, URL, tienda, y más."
              action={
                <Tooltip title={dataOpen ? 'Ocultar datos' : 'Mostrar Datos'}>
                  <IconButton
                    aria-label="Datos"
                    onClick={() => setDataOpen((open) => !open)}
                  >
                    <SvgIcon fontSize="small">
                      {dataOpen ? <ChevronDown /> : <ChevronRight />}
                    </SvgIcon>
                  </IconButton>
                </Tooltip>
              }
            />

            <Collapse
              in={dataOpen}
              sx={{ padding: 5, paddingTop: 0, paddingBottom: 0 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Titulo"
                    type="text"
                    value={landingPage?.title || ''}
                    onChange={(e) => handleTitle(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="URL"
                    type="text"
                    value={landingPage?.url}
                    onChange={(e) => handleUrl(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    fullWidth
                    format="dd/MM/yyyy"
                    value={
                      landingPage?.from ? new Date(landingPage?.from) : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = date.toISOString().split('T')[0]; // Formato yyyy-mm-dd
                        setEditedFrom(formattedDate);
                      } else {
                        setEditedFrom(null);
                      }
                    }}
                    label="Fecha de inicio"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    clearable
                    fullWidth
                    format="dd/MM/yyyy"
                    value={landingPage?.to ? new Date(landingPage?.to) : null}
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = date.toISOString().split('T')[0]; // Formato yyyy-mm-dd
                        setEditedTo(formattedDate);
                      } else {
                        setEditedTo(null);
                      }
                    }}
                    label="Fecha de fin"
                    slots={{ textField: TextField }} // Nuevo sistema de slots
                    slotProps={{
                      textField: { InputLabelProps: { required: true } },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tienda"
                    select
                    SelectProps={{ native: true }}
                    value={landingPage?.store_id || ''}
                    onChange={(event) => handleStore(event.target.value)}
                  >
                    {stores.map((store) => (
                      <option key={store.id} value={store?.id}>
                        {store.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!landingPage?.active} // Forzar conversión a booleano
                        onChange={handleSwitchChange}
                      />
                    }
                    label="Activado"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  style={{ textAlign: 'right', marginBottom: 5 }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={guardarDataLanding}
                    sx={{ marginRight: 2 }}
                    startIcon={<AddIcon />}
                  >
                    Guardar
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={openDeleteModal}
                    startIcon={<DeleteIcon />}
                  >
                    Eliminar
                  </Button>
                </Grid>
              </Grid>
            </Collapse>
          </Card>

          <Box display="flex" justifyContent="right" mb={3} mt={3}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => handleOpenDialog('header')}
              sx={{ marginRight: 2, padding: '4px 8px', fontSize: '0.875rem' }}
              startIcon={<AddIcon />}
            >
              Banner
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleOpenDialog('box')}
              sx={{ marginRight: 2 }}
              startIcon={<AddIcon />}
            >
              Box
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleOpenDialog('carrousel')}
              sx={{ marginRight: 2 }}
              startIcon={<AddIcon />}
            >
              Carrousel
            </Button>
          </Box>

          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Landing Page #{landingPage.landingId} ({landingPage.title})
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="textSecondary"
                gutterBottom
              >
                Creado el {createdAt}
              </Typography>

              {/* Contenido de la landing page */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <LandingPageCard
                    landingPage={landingPage}
                    editable={editable}
                    refetch={refetch}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Diálogo para agregar componentes */}
          <LandingCreateComponentModal
            open={openDialog}
            onClose={handleCloseDialog}
            componentType={componentType}
            onAddComponent={handleAddComponent}
            refetch={refetch}
          />
        </Container>

        <LandingPageDeleteConfirmModal
          open={open}
          onClose={closeDeleteModal}
          onConfirm={removeSelected}
          id={id}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

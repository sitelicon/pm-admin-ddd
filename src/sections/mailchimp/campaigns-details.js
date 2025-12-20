import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import {
  Button,
  Card,
  CardHeader,
  Chip,
  Stack,
  TextField,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { PropertyList } from '../../components/property-list';
import { PropertyListItem } from '../../components/property-list-item';
import { useEffect, useState } from 'react';
import { mailchimpApi } from '../../api/mailchimp';

const statusColors = {
  sent: {
    color: 'success',
    text: 'Enviado',
  },
  save: {
    color: 'info',
    text: 'Guardado',
  },
  schedule: {
    color: 'info',
    text: 'Programado',
  },
  sending: {
    color: 'info',
    text: 'Enviando',
  },
  canceled: {
    color: 'error',
    text: 'Cancelado',
  },
  canceling: {
    color: 'warning',
    text: 'Canceléndose',
  },
  archive: {
    color: 'warning',
    text: 'Archivado',
  },
  delivering: {
    color: 'info',
    text: 'Enviándose',
  },
  delivered: {
    color: 'success',
    text: 'Entregados',
  },
};

const useCampaign = (campaignId, campaign) => {
  const [state, setState] = useState({
    mailchimp: {
      id: '',
      mailchimp_campaign_id: campaignId,
      name: '',
      mailchimp_id: '',
      utm_value: '',
    },
    loading: true,
  });

  const getMailchimpCampaign = async (campaignId) => {
    try {
      setState((state) => ({ ...state, loading: true }));
      await mailchimpApi.getCampaignBBDD(campaignId).then((response) => {
        setState({
          mailchimp: {
            id: response.id,
            name: response.name,
            mailchimp_campaign_id: campaignId,
            mailchimp_id: response.mailchimp_id,
            utm_value: response.utm_value,
          },
          loading: false,
        });
      });
    } catch (error) {
      setState((state) => ({
        ...state,
        mailchimp: {
          name: campaign.settings.title || '',
          mailchimp_campaign_id: campaignId,
          mailchimp_id: '',
          utm_value: '',
        },
        loading: false,
      }));
    }
  };

  const handleUpdateCreate = () => {
    if (state.mailchimp.id) {
      updateCampaign(campaign.id, state.mailchimp);
    } else {
      createCampaign(state.mailchimp);
    }
  };

  const updateCampaign = async (campaignId, data) => {
    try {
      setState((state) => ({ ...state, loading: true }));
      await mailchimpApi
        .updateCampaignBBDD(campaignId, data)
        .then((response) => {
          setState({
            mailchimp: {
              name: response.name,
              mailchimp_id: response.mailchimp_id,
              utm_value: response.utm_value,
            },
            loading: false,
          });
        });
      toast.success('Campaña actualizada correctamente');
    } catch (error) {
      console.error(error);
      setState((state) => ({ ...state, loading: false }));
      toast.error('Error al guardar la campaña');
    }
  };

  const createCampaign = async (data) => {
    try {
      setState((state) => ({ ...state, loading: true }));
      await mailchimpApi.createCampaignBBDD(data).then((response) => {
        setState({
          mailchimp: {
            id: response.id,
            name: response.name,
            mailchimp_id: response.mailchimp_id,
            utm_value: response.utm_value,
          },
          loading: false,
        });
      });
      toast.success('Campaña guardada correctamente');
    } catch (error) {
      console.error(error);
      setState((state) => ({ ...state, loading: false }));
      toast.error('Error al guardar la campaña');
    }
  };

  useEffect(() => {
    if (campaignId) getMailchimpCampaign(campaignId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  return {
    mailchimpName: state.mailchimp.name,
    mailchimpId: state.mailchimp.mailchimp_id,
    utmCampaign: state.mailchimp.utm_value,
    updateCampaign: setState,
    handleUpdateCreate,
    loading: state.loading,
  };
};

export const CampaignsDetails = (props) => {
  const { campaign } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const align = lgUp ? 'horizontal' : 'vertical';
  const {
    mailchimpName,
    mailchimpId,
    utmCampaign,
    updateCampaign,
    handleUpdateCreate,
    loading,
  } = useCampaign(campaign.id, campaign);

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid xs={12} md={6} lg={7}>
          <Card>
            <CardHeader title="Información básica" />
            <PropertyList>
              <PropertyListItem
                align={align}
                divider
                label="Nombre"
                value={campaign.settings.title || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Preview"
                value={campaign.settings.preview_text || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Estatus"
                value={
                  <Chip
                    color={statusColors[campaign.status].color}
                    label={statusColors[campaign.status].text}
                    size="small"
                  />
                }
              />

              <PropertyListItem
                align={align}
                divider
                label="Fecha de creación"
                value={
                  campaign.create_time
                    ? format(new Date(campaign.create_time), 'P', {
                        locale: es,
                      })
                    : 'Desconocido'
                }
              />
            </PropertyList>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={5}>
          <Card>
            <CardHeader title="Estatus Envíos" />
            <PropertyList>
              <PropertyListItem
                align={align}
                divider
                label="Listado"
                value={campaign.recipients.list_name || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Estado"
                value={
                  <Chip
                    color={
                      statusColors[campaign.delivery_status.status]?.color ||
                      'default'
                    }
                    label={
                      statusColors[campaign.delivery_status.status]?.text ||
                      'Desconocido'
                    }
                    size="small"
                  />
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Emails enviados"
                value={campaign.delivery_status.emails_sent || 0}
              />
              <PropertyListItem
                align={align}
                divider
                label="Emails cancelados"
                value={campaign.delivery_status.emails_canceled || 0}
              />
            </PropertyList>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={7}>
          <Card>
            <CardHeader title="Reporte básico" />
            <PropertyList>
              <PropertyListItem
                align={align}
                divider
                label="Clicks"
                value={campaign.report_summary?.clicks || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Rate clicks"
                value={
                  campaign.report_summary?.click_rate.toFixed(7) + '%' ||
                  'Desconocido'
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Aperturas"
                value={campaign.report_summary?.opens || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Rate aperturas"
                value={
                  campaign.report_summary?.open_rate.toFixed(7) + '%' ||
                  'Desconocido'
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Aperturas únicas"
                value={campaign.report_summary?.unique_opens || 'Desconocido'}
              />
              <PropertyListItem
                align={align}
                divider
                label="Clicks subscriptores"
                value={
                  campaign.report_summary?.subscriber_clicks || 'Desconocido'
                }
              />
            </PropertyList>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={5}>
          <Card>
            <CardHeader title="Conversión" />
            <PropertyList>
              <PropertyListItem
                align={align}
                divider
                label="Órdenes"
                value={
                  campaign.report_summary?.ecommerce.total_orders ||
                  'Desconocido'
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Ingresos"
                value={
                  campaign.report_summary?.ecommerce.total_revenue ||
                  'Desconocido'
                }
              />
              <PropertyListItem
                align={align}
                divider
                label="Total Gastado"
                value={
                  campaign.report_summary?.ecommerce.total_spent ||
                  'Desconocido'
                }
              />
              <CardHeader title="Gestión" />
              <Stack
                spacing={1}
                paddingLeft={3}
                paddingRight={3}
                paddingBottom={3}
                direction={'column'}
              >
                <TextField
                  id="standard-basic"
                  label="Nombre"
                  value={mailchimpName}
                  onChange={(e) => {
                    updateCampaign((prev) => ({
                      ...prev,
                      mailchimp: { ...prev.mailchimp, name: e.target.value },
                    }));
                  }}
                  disabled={loading}
                  variant="outlined"
                  style={{ paddingBottom: 10 }}
                />
                <TextField
                  id="standard-basic"
                  label="Mailchimp ID"
                  variant="outlined"
                  value={mailchimpId}
                  disabled={loading}
                  onChange={(e) => {
                    updateCampaign((prev) => ({
                      ...prev,
                      mailchimp: {
                        ...prev.mailchimp,
                        mailchimp_id: e.target.value,
                      },
                    }));
                  }}
                  style={{ paddingBottom: 10 }}
                  helperText="Los ids de campaña se encuentran en la URL de mailchimp a la hora de editarla(.../edit?id=249855). Por ejemplo, el id de la campaña es 249855."
                />
                <TextField
                  id="standard-basic"
                  label="Campaña UTM"
                  variant="outlined"
                  value={utmCampaign}
                  onChange={(e) => {
                    updateCampaign((prev) => ({
                      ...prev,
                      mailchimp: {
                        ...prev.mailchimp,
                        utm_value: e.target.value,
                      },
                    }));
                  }}
                  disabled={loading}
                  helperText="Valor de la campaña para Google Analytics. Este valor se encuentra en los enlaces de los correos. Lo encontrarás al final del enlace como 'utm_campaign=nueva_col_11_es' en este caso el valor es 'nueva_col_11_es'."
                />
                <Button
                  disabled={loading}
                  variant="contained"
                  onClick={handleUpdateCreate}
                >
                  Guardar
                </Button>
              </Stack>
            </PropertyList>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

PropTypes.CampaignsDetails = {
  campaign: PropTypes.object.isRequired,
};

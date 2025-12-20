import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { mailchimpApi } from '../../api/mailchimp';
const chipOptions = {
  save: {
    color: 'info',
    label: 'Guardado',
  },
  paused: {
    color: 'warning',
    label: 'Pausado',
  },
  schedule: {
    color: 'info',
    label: 'Programado',
  },
  sending: {
    color: 'info',
    label: 'Enviando',
  },
  sent: {
    color: 'success',
    label: 'Enviado',
  },
};

export const CampaignsListItemTable = (props) => {
  const { campaign } = props;
  const [openCloneModal, setOpenCloneModal] = useState(false);

  const closeModal = () => {
    setOpenCloneModal(false);
  };

  const handleChangeModalState = () => {
    setOpenCloneModal(!openCloneModal);
  };

  const handleClone = async () => {
    try {
      const res = await mailchimpApi.duplicateCampaign(campaign.id);
      if (res) {
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TableRow key={campaign.id} hover>
      <TableCell>
        <Link
          component={NextLink}
          href={`/mailchimp/campaign/${campaign.id}`}
          color="primary"
          variant="caption"
        >
          {campaign.id}
        </Link>
      </TableCell>
      <TableCell>
        <Typography
          variant="caption"
          color={'text.primary'}
          whiteSpace="nowrap"
        >
          {campaign.settings.title}
        </Typography>
      </TableCell>
      <TableCell>{campaign.recipients.list_name}</TableCell>
      <TableCell>{campaign.emails_sent ?? 'Sin datos'}</TableCell>
      <TableCell>
        <Typography
          variant="caption"
          color={'text.primary'}
          whiteSpace="nowrap"
        >
          {campaign.report_summary?.open_rate
            ? campaign.report_summary?.open_rate.toFixed(5) + '%'
            : 'Sin datos'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="caption"
          color={'text.primary'}
          whiteSpace="nowrap"
        >
          {campaign.report_summary?.click_rate
            ? campaign.report_summary?.click_rate.toFixed(5) + '%'
            : 'Sin datos'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="caption"
          color={'text.primary'}
          whiteSpace="nowrap"
        >
          {format(new Date(campaign.create_time), 'd MMM, yyyy', {
            locale: es,
          })}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="caption"
          color={'text.primary'}
          whiteSpace="nowrap"
        >
          {chipOptions[campaign.status] && (
            <Chip
              label={chipOptions[campaign.status].label}
              color={chipOptions[campaign.status].color}
            />
          )}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleChangeModalState}
        >
          Clonar
        </Button>
      </TableCell>
      <Dialog open={openCloneModal} onClose={closeModal}>
        <DialogTitle>Clonar campaña</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas clonar la campaña?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangeModalState} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleClone} variant="contained" color="primary">
            Clonar
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
};

CampaignsListItemTable.propTypes = {
  campaign: PropTypes.object.isRequired,
};

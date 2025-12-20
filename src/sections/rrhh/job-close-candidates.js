import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Stack,
  Checkbox,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Dialog,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { jobDemandsAPI } from '../../api/job-demands';
import { useSelectionModel } from '../../hooks/use-selection-model';
import { jobsOfferAPI } from '../../api/jobs-offers';

const useCandidates = (jobOfferId) => {
  const [state, setState] = useState({
    loading: true,
    candidates: [],
    error: null,
  });

  const getCandidates = async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const res = await jobDemandsAPI.getJobOffer(jobOfferId);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        candidates: res,
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false, error: err }));
    }
  };

  useEffect(() => {
    getCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobOfferId]);

  return {
    loading: state.loading,
    candidates: state.candidates,
  };
};

export const ModalCloseOffer = ({ open, onClose, jobOffer }) => {
  const { candidates, loading } = useCandidates(jobOffer.id);
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(candidates);
  const handleToggleAll = useCallback(
    (event) => {
      const { checked } = event.target;

      if (checked) {
        selectAll();
      } else {
        deselectAll();
      }
    },
    [selectAll, deselectAll],
  );

  const selectedAll = selected.length === candidates?.length;
  const selectedSome =
    selected.length > 0 && selected.length < candidates?.length;

  const handleSendEmails = async () => {
    try {
      const emails = candidates
        .filter((candidate) => selected.includes(candidate.id))
        .map((candidate) => candidate.demand_email);

      if (emails.length === 0) {
        toast.error('No hay candidatos seleccionados');
      }

      const res = await jobsOfferAPI.postSendEmails(jobOffer.id, { emails });
      if (res) {
        toast.success('Correos enviados');
        onClose();
      } else {
        toast.error('Error al enviar correos. Inténtelo de nuevo más tarde.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog scroll="body" open={open} onClose={onClose} maxWidth="xl">
      <Card>
        <CardHeader
          title={<Typography variant="h5">Cerrar oferta de empleo</Typography>}
          subheader={
            <Typography variant="body2">
              Vas a cerrar {jobOffer.name}, enviando correos a los candidatos
              seleccionados para que sepan que no han sido seleccionados.
              Selecciona aquellos que deseas notificar:
            </Typography>
          }
        />

        <CardContent>
          <Scrollbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedAll}
                      indeterminate={selectedSome}
                      onChange={handleToggleAll}
                    />
                  </TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 3 }} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Buscando...
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {candidates?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 3 }} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No hay candidatos para esta oferta de empleo.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {candidates &&
                  !loading &&
                  candidates?.map((jobCandidate) => {
                    return (
                      <TableRow key={jobCandidate.id}>
                        <TableCell>
                          <Checkbox
                            checked={selected.includes(jobCandidate.id)}
                            onChange={(event) => {
                              const { checked } = event.target;

                              if (checked) {
                                selectOne(jobCandidate.id);
                              } else {
                                deselectOne(jobCandidate.id);
                              }
                            }}
                            value={selected.includes(jobCandidate.id)}
                          />
                        </TableCell>
                        <TableCell>
                          {jobCandidate.demand_name}{' '}
                          {jobCandidate.demand_surname}
                        </TableCell>
                        <TableCell>{jobCandidate.demand_email}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Scrollbar>
        </CardContent>

        <Stack
          justifyContent="space-between"
          direction="row"
          paddingX={2}
          paddingY={2}
        >
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => onClose()}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSendEmails}
          >
            Enviar
          </Button>
        </Stack>
      </Card>
    </Dialog>
  );
};

import { useState, useMemo, useCallback, useEffect } from 'react';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
  Skeleton,
  Typography,
  Link,
  Chip,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { useSelectionModel } from '../../hooks/use-selection-model';
import { JobOffersCloneModal } from './job-offers-clone-modal';

const TableRowItem = ({
  jobOffer,
  isSelected,
  selectOne,
  deselectOne,
  columns,
}) => {
  const [openModalClone, setOpenModalClone] = useState(false);
  const handleOpenModalClone = (id) => {
    setOpenModalClone(true);
  };

  return (
    <>
      <TableRow key={jobOffer.id} hover>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={() => {
              if (isSelected) {
                deselectOne(jobOffer.id);
              } else {
                selectOne(jobOffer.id);
              }
            }}
          />
        </TableCell>
        {columns.includes('position_name') && (
          <TableCell>
            <Link component={NextLink} href={`/rrhh/${jobOffer.id}`}>
              {jobOffer.position_name}
            </Link>
          </TableCell>
        )}
        {columns.includes('store') && (
          <TableCell>
            {jobOffer.physical_store?.name ?? jobOffer.store_name}
          </TableCell>
        )}
        {columns.includes('country') && (
          <TableCell>{jobOffer.country.nicename}</TableCell>
        )}
        {columns.includes('languages_id') && (
          <TableCell>{jobOffer.language.language}</TableCell>
        )}
        {columns.includes('visibility') && (
          <TableCell
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {jobOffer.visibility ? (
              <Chip label="VISIBLE" color="success" />
            ) : (
              <Chip label="NO VISIBLE" color="default" />
            )}
          </TableCell>
        )}
        <TableCell align="center">
          <Button
            color="warning"
            size="small"
            onClick={() => {
              handleOpenModalClone(jobOffer.id);
            }}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Clonar
          </Button>
          <Link
            component={NextLink}
            href={`/rrhh/${jobOffer.id}`}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Editar
          </Link>
        </TableCell>
      </TableRow>
      <JobOffersCloneModal
        open={openModalClone}
        onClose={() => setOpenModalClone(false)}
        jobOffer={jobOffer}
      />
    </>
  );
};

export const JobOffersListTable = ({
  jobOffers,
  columns,
  loadingOffers,
  deleteJobOffer,
  ...other
}) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(jobOffers);

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

  const selectedAll = selected.length === jobOffers.length;
  const selectedSome =
    selected.length > 0 && selected.length < jobOffers.length;
  const enableBulkActions = selected.length > 0;

  return (
    <Box sx={{ position: 'relative' }} {...other}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={handleToggleAll}
          />
          <Button
            color="error"
            size="small"
            onClick={() => {
              selected.forEach((id) => deleteJobOffer(id));
              deselectAll();
            }}
          >
            Eliminar
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              {columns.includes('position_name') && (
                <TableCell>Posición</TableCell>
              )}
              {columns.includes('store') && <TableCell>Tienda</TableCell>}
              {columns.includes('country') && <TableCell>País</TableCell>}
              {columns.includes('languages_id') && (
                <TableCell>Idioma</TableCell>
              )}
              {columns.includes('visibility') && (
                <TableCell align="center">Visibilidad</TableCell>
              )}
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingOffers &&
              Array.from(Array(5)).map((_, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell width="1px" align="center">
                    <Skeleton
                      variant="rectangular"
                      width={50}
                      height={50}
                      sx={{
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  {Array.from(Array(columns.length)).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                      {index === 0 && (
                        <Skeleton
                          variant="text"
                          width={100}
                          sx={{
                            marginTop: 1,
                          }}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loadingOffers && jobOffers.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay ofertas de trabajo disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loadingOffers &&
              jobOffers.map((jobOffer) => {
                const isSelected = selected.includes(jobOffer.id);

                return (
                  <TableRowItem
                    key={jobOffer.id}
                    columns={columns}
                    jobOffer={jobOffer}
                    isSelected={isSelected}
                    selectOne={selectOne}
                    deselectOne={deselectOne}
                  />
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};

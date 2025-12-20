import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  Link,
  Skeleton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { Telescope } from '@untitled-ui/icons-react';
import { useSelectionModel } from '../../hooks/use-selection-model';

export const ColorListTable = (props) => {
  const {
    onPageChange,
    onPerPageChange,
    page,
    colors,
    colorCount,
    perPage,
    loading,
    columns,
    ...other
  } = props;

  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(colors);

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

  const selectedAll = selected.length === colors.length;
  const selectedSome = selected.length > 0 && selected.length < colors.length;
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
          <Button color="error" size="small">
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
              {columns.includes('pallete') && (
                <TableCell width="1px" align="center">
                  Paleta
                </TableCell>
              )}
              {columns.includes('name_admin') && <TableCell>NOMBRE</TableCell>}
              {columns.includes('hexadecimal') && (
                <TableCell>HEXADECIMAL</TableCell>
              )}
              {columns.includes('language_es') && (
                <TableCell>🇪🇸 ESPAÑOL</TableCell>
              )}
              {columns.includes('language_pt') && (
                <TableCell>🇵🇹 PORTUGUÉS</TableCell>
              )}
              {columns.includes('language_fr') && (
                <TableCell>🇫🇷 FRANCÉS</TableCell>
              )}
              {columns.includes('language_it') && (
                <TableCell>🇮🇹 ITALIANO</TableCell>
              )}
              {columns.includes('language_en') && (
                <TableCell>🇬🇧 INGLÉS</TableCell>
              )}

              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
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
            {!loading && colors.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 3} align="center">
                  <Stack alignItems="center" spacing={2} sx={{ p: 4 }}>
                    <SvgIcon fontSize="large" color="disabled">
                      <Telescope />
                    </SvgIcon>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron colores que coincidan con los filtros
                      aplicados.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              colors.map((color) => {
                const isSelected = selected.includes(color.id);
                const dataES = color.colordata.find(
                  (data) => data.languages_id === 1,
                );
                const dataPT = color.colordata.find(
                  (data) => data.languages_id === 4,
                );
                const dataFR = color.colordata.find(
                  (data) => data.languages_id === 3,
                );
                const dataIT = color.colordata.find(
                  (data) => data.languages_id === 5,
                );

                const dataEN = color.colordata.find(
                  (data) => data.languages_id === 2,
                );

                return (
                  <TableRow key={color.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;
                          if (checked) {
                            selectOne(color.id);
                          } else {
                            deselectOne(color.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    {columns.includes('pallete') && (
                      <TableCell width="1px">
                        <Stack
                          direction="row"
                          alignContent="center"
                          justifyContent="center"
                        >
                          <Box
                            sx={{
                              alignItems: 'center',
                              backgroundColor: `${color.hexadecimal}`,
                              backgroundPosition: 'center',
                              backgroundSize: 'cover',
                              background:
                                color.name_admin === '90-MULTICO'
                                  ? 'linear-gradient(60deg, #ff6961, #77dd77, #fdfd96, #84b6f4, #fdcae1)'
                                  : '',
                              border: '1px solid #E0E0E0',
                              borderRadius: 1,
                              display: 'flex',
                              height: 50,
                              justifyContent: 'center',
                              overflow: 'hidden',
                              width: 50,
                            }}
                          />
                        </Stack>
                      </TableCell>
                    )}
                    {columns.includes('name_admin') && (
                      <TableCell>
                        <Link
                          component={NextLink}
                          href={`/colors/${color.id}`}
                          color="primary"
                          variant="caption"
                        >
                          {color.name_admin || 'Color sin nombre'}
                        </Link>
                      </TableCell>
                    )}
                    {columns.includes('hexadecimal') && (
                      <TableCell>{color.hexadecimal}</TableCell>
                    )}
                    {columns.includes('language_es') && (
                      <TableCell>
                        <Typography
                          variant="caption"
                          color={
                            dataES?.label ? 'text.primary' : 'text.disabled'
                          }
                          whiteSpace="nowrap"
                        >
                          {dataES.label || 'Sin nombre'}
                        </Typography>
                      </TableCell>
                    )}
                    {columns.includes('language_pt') && (
                      <TableCell>
                        <Typography
                          variant="caption"
                          color={
                            dataPT?.label ? 'text.primary' : 'text.disabled'
                          }
                          whiteSpace="nowrap"
                        >
                          {dataPT?.label || 'Sin nombre'}
                        </Typography>
                      </TableCell>
                    )}
                    {columns.includes('language_fr') && (
                      <TableCell>
                        <Typography
                          variant="caption"
                          color={
                            dataFR?.label ? 'text.primary' : 'text.disabled'
                          }
                          whiteSpace="nowrap"
                        >
                          {dataFR?.label || 'Sin nombre'}
                        </Typography>
                      </TableCell>
                    )}
                    {columns.includes('language_it') && (
                      <TableCell>
                        <Typography
                          variant="caption"
                          color={
                            dataIT?.label ? 'text.primary' : 'text.disabled'
                          }
                          whiteSpace="nowrap"
                        >
                          {dataIT?.label || 'Sin nombre'}
                        </Typography>
                      </TableCell>
                    )}
                    {columns.includes('language_en') && (
                      <TableCell>
                        <Typography
                          variant="caption"
                          color={
                            dataEN?.label ? 'text.primary' : 'text.disabled'
                          }
                          whiteSpace="nowrap"
                        >
                          {dataEN?.label || 'Sin nombre'}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/colors/${color.id}`}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Editar
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};

ColorListTable.propTypes = {
  colors: PropTypes.array.isRequired,
  colorsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
};

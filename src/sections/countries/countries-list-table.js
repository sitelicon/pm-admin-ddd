import { useCallback } from 'react';
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
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Telescope } from '@untitled-ui/icons-react';
import { Scrollbar } from '../../components/scrollbar';
import { useSelectionModel } from '../../hooks/use-selection-model';
import { TablePaginationActions } from '../../components/table-pagination-actions';

export const CountriesListTable = (props) => {
  const {
    onPageChange,
    onPerPageChange,
    page,
    countries,
    countriesCount,
    perPage,
    loading,
    columns,
    ...other
  } = props;

  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(countries);

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

  const selectedAll = selected.length === countries.length;
  const selectedSome =
    selected.length > 0 && selected.length < countries.length;
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
              {columns.includes('name') && (
                <TableCell align="center">Nombre oficial</TableCell>
              )}
              {columns.includes('nicename') && (
                <TableCell align="center">Nombre país</TableCell>
              )}
              {columns.includes('iso') && (
                <TableCell align="center">ISO</TableCell>
              )}
              {columns.includes('iso3') && (
                <TableCell align="center">ISO3</TableCell>
              )}
              {columns.includes('postal_code_format') && (
                <TableCell align="center" width="1px">
                  Formato código postal
                </TableCell>
              )}
              {columns.includes('postal_code_regex') && (
                <TableCell align="center" width="1px">
                  Regex código postal
                </TableCell>
              )}
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(6)).map((_, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton
                      variant="rectangular"
                      width={50}
                      height={50}
                      sx={{
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  {Array.from(Array(columns.length + 1)).map((_, index) => (
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
            {!loading && countries.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Stack alignItems="center" spacing={2} sx={{ p: 4 }}>
                    <SvgIcon fontSize="large" color="disabled">
                      <Telescope />
                    </SvgIcon>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron países que coincidan con los filtros
                      aplicados.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              countries.map((country) => {
                const isSelected = selected.includes(country.id);
                return (
                  <TableRow key={country.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;
                          if (checked) {
                            selectOne(country.id);
                          } else {
                            deselectOne(country.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    {columns.includes('name') && (
                      <TableCell align="center">
                        <Link
                          component={NextLink}
                          href={`/countries/${country.id}`}
                          color="primary"
                          variant="caption"
                        >
                          {country.name || 'País sin nombre'}
                        </Link>
                      </TableCell>
                    )}
                    {columns.includes('nicename') && (
                      <TableCell align="center">{country.nicename}</TableCell>
                    )}
                    {columns.includes('iso') && (
                      <TableCell align="center">{country.iso}</TableCell>
                    )}
                    {columns.includes('iso3') && (
                      <TableCell align="center">{country.iso3}</TableCell>
                    )}
                    {columns.includes('postal_code_format') && (
                      <TableCell align="center">
                        {country.postal_code_format ?? '-'}
                      </TableCell>
                    )}
                    {columns.includes('postal_code_regex') && (
                      <TableCell align="center">
                        {country.postal_code_regex ?? '-'}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/countries/${country.id}`}
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
      <TablePagination
        component="div"
        count={countriesCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Países por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </Box>
  );
};

CountriesListTable.propTypes = {
  countries: PropTypes.array.isRequired,
  countriesCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
};

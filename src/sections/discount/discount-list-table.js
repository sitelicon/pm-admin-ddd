import { useCallback, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import {
  Checkbox,
  IconButton,
  Link,
  Skeleton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import { Pencil01 } from '@untitled-ui/icons-react';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

export const DiscountListTable = ({
  onPageChange,
  onPerPageChange,
  page,
  discounts,
  discountsCount,
  perPage,
  loading,
  columns,
  ...other
}) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(discounts);

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

  const selectedAll = selected.length === discounts.length;
  const selectedSome =
    selected.length > 0 && selected.length < discounts.length;

  return (
    <div {...other}>
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
              <TableCell>ID</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Empieza</TableCell>
              <TableCell>Termina</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tiendas</TableCell>
              <TableCell>Grupos</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="center">Valor</TableCell>
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
                  {Array.from(Array(9)).map((_, index) => (
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
            {!loading &&
              discounts.map((discount) => {
                const isItemSelected = selected.includes(discount.id);
                const isActive = discount.to
                  ? discount.active && new Date(discount.to) > new Date()
                  : discount.active;

                return (
                  <TableRow key={discount.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => {
                          if (isItemSelected) {
                            deselectOne(discount.id);
                          } else {
                            selectOne(discount.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{discount.id}</TableCell>
                    <TableCell>
                      <Tooltip placement="top" title={discount.description}>
                        <Link
                          color="inherit"
                          component={NextLink}
                          href={`/discounts/${discount.id}`}
                        >
                          {discount.name}
                        </Link>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {discount.from ? (
                        `${new Date(discount.from).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}, ${new Date(discount.from).toLocaleTimeString(
                          'es-ES',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          },
                        )}`
                      ) : (
                        <span>&mdash;</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {discount.to ? (
                        `${new Date(discount.to).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}, ${new Date(discount.to).toLocaleTimeString(
                          'es-ES',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          },
                        )}`
                      ) : (
                        <span>&mdash;</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={isActive ? 'success' : 'error'}>
                        {isActive ? 'Activo' : 'Inactivo'}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {discount.stores
                        .map((store) => store.code.toUpperCase())
                        .join(', ')}
                    </TableCell>
                    <TableCell>
                      {discount.customer_groups
                        .map((group) => group.name)
                        .join(', ')}
                    </TableCell>
                    <TableCell>
                      {
                        discount.type.labels.find(
                          ({ language_id }) => language_id === 1,
                        ).label
                      }
                    </TableCell>
                    <TableCell align="center">
                      {discount.value.toLocaleString('es-ES', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/discounts/${discount.id}`}
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
        count={discountsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Descuentos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </div>
  );
};

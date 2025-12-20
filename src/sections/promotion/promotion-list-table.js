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
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import { Pencil01 } from '@untitled-ui/icons-react';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

export const PromotionListTable = ({
  onPageChange,
  onPerPageChange,
  page,
  promotions,
  promotionsCount,
  perPage,
  loading,
  columns,
  ...other
}) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(promotions);

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

  const selectedAll = selected.length === promotions.length;
  const selectedSome =
    selected.length > 0 && selected.length < promotions.length;

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
              <TableCell>Promoción</TableCell>
              <TableCell>Código</TableCell>
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
                  {Array.from(Array(11)).map((_, index) => (
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
              promotions.map((promotion) => {
                const isItemSelected = selected.includes(promotion.id);
                const isActive = promotion.to
                  ? promotion.active && new Date(promotion.to) > new Date()
                  : promotion.active;

                return (
                  <TableRow key={promotion.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => {
                          if (isItemSelected) {
                            deselectOne(promotion.id);
                          } else {
                            selectOne(promotion.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{promotion.id}</TableCell>
                    <TableCell>
                      <Tooltip placement="top" title={promotion.description}>
                        <Link
                          color="inherit"
                          component={NextLink}
                          href={`/promotions/${promotion.id}`}
                        >
                          {promotion.name}
                        </Link>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {promotion.coupon_code || (
                        <Typography color="text.secondary" variant="caption">
                          &mdash;
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {promotion.from ? (
                        `${new Date(promotion.from).toLocaleDateString(
                          'es-ES',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          },
                        )}, ${new Date(promotion.from).toLocaleTimeString(
                          'es-ES',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          },
                        )}`
                      ) : (
                        <Typography color="text.secondary" variant="caption">
                          &mdash;
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {promotion.to ? (
                        `${new Date(promotion.to).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}, ${new Date(promotion.to).toLocaleTimeString(
                          'es-ES',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          },
                        )}`
                      ) : (
                        <Typography color="text.secondary" variant="caption">
                          &mdash;
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={isActive ? 'success' : 'error'}>
                        {isActive ? 'Activo' : 'Inactivo'}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {promotion.stores
                        .map((store) => store.code.toUpperCase())
                        .join(', ')}
                    </TableCell>
                    <TableCell>
                      {promotion.customer_groups
                        .map((group) => group.name)
                        .join(', ')}
                    </TableCell>
                    <TableCell>
                      {
                        promotion.type.labels.find(
                          ({ language_id }) => language_id === 1,
                        ).label
                      }
                    </TableCell>
                    <TableCell align="center">
                      {promotion.value.toLocaleString('es-ES', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/promotions/${promotion.id}`}
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
        count={promotionsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Promociones por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
    </div>
  );
};

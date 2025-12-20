import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  Link,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { SeverityPill } from '../../components/severity-pill';
import NextLink from 'next/link';
import { LayoutHomeWebDeleteConfirmModal } from './layout-home-web-delete-confirm-modal';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';
import { useStores } from '../../hooks/use-stores';

export const LayoutHomeWebListTable = (props) => {
  const {
    onPageChange,
    onPerPageChange,
    layoutHomeWebs,
    layoutHomeWebsCount,
    page,
    perPage,
    loading,
    handleRemove,
    ...other
  } = props;

  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(layoutHomeWebs);
  const [open, setOpen] = useState(false);
  const stores = useStores();

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

  const selectedAll = selected.length === layoutHomeWebs.length;
  const selectedSome =
    selected.length > 0 && selected.length < layoutHomeWebs.length;
  const enableBulkActions = selected.length > 0;

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
          <Button color="error" size="small" onClick={openDeleteModal}>
            Eliminar
          </Button>
        </Stack>
      )}
      {/* <Scrollbar style={{ maxHeight: 'calc(100vh - 347px)' }}> */}
      <Scrollbar>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleToggleAll}
                />
              </TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Posición</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from(Array(10)).map((_, index) => (
                <TableRow hover key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={100} sx={{ mt: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      variant="rectangular"
                      width={40}
                      height={40}
                      sx={{
                        blayoutHomeWebRadius: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
            {!loading &&
              layoutHomeWebs.map((layoutHomeWeb) => {
                const isSelected = selected.includes(layoutHomeWeb.id);
                const color = layoutHomeWeb.is_active ? 'success' : 'error';

                return (
                  <TableRow
                    hover
                    key={layoutHomeWeb.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;
                          if (checked) {
                            selectOne(layoutHomeWeb.id);
                          } else {
                            deselectOne(layoutHomeWeb.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>
                      {
                        stores.find(
                          (store) => store.id === layoutHomeWeb.store_id,
                        )?.name
                      }
                    </TableCell>
                    <TableCell>{layoutHomeWeb.position}</TableCell>
                    <TableCell>{layoutHomeWeb.object_type}</TableCell>
                    <TableCell>{layoutHomeWeb.object_id}</TableCell>
                    <TableCell>
                      <SeverityPill color={color}>
                        {layoutHomeWeb.is_active ? 'Active' : 'Inactive'}
                      </SeverityPill>
                    </TableCell>
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/layout-home-web/${layoutHomeWeb.id}`}
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
        count={layoutHomeWebsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Elementos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
      <LayoutHomeWebDeleteConfirmModal
        open={open}
        onClose={closeDeleteModal}
        onConfirm={removeSelected}
      />
    </Box>
  );
};

LayoutHomeWebListTable.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  onPerPageChange: PropTypes.func,
  layoutHomeWebs: PropTypes.array.isRequired,
  layoutHomeWebsCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

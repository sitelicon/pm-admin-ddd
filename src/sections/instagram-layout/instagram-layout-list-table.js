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
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import NextLink from 'next/link';
import { paths } from '../../paths';
import { InstagramLayoutDeleteConfirmModal } from './instagram-layout-delete-confirm-modal';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

export const InstagramLayoutListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    instagramLayouts,
    instagramLayoutsCount,
    page,
    perPage,
    loading,
    handleRemove,
    ...other
  } = props;

  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(instagramLayouts);

  const [open, setOpen] = useState(false);

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

  const selectedAll = selected.length === instagramLayouts.length;
  const selectedSome =
    selected.length > 0 && selected.length < instagramLayouts.length;
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
              <TableCell>#</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Titulo</TableCell>
              <TableCell>Footer</TableCell>
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
                        binstagramLayoutRadius: 1,
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
              instagramLayouts.map((instagramLayout) => {
                const isSelected = selected.includes(instagramLayout.id);
                const color = instagramLayout.is_active ? 'success' : 'error';

                return (
                  <TableRow
                    hover
                    key={instagramLayout.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;
                          if (checked) {
                            selectOne(instagramLayout.id);
                          } else {
                            deselectOne(instagramLayout.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>{instagramLayout.id}</TableCell>
                    <TableCell>{instagramLayout.name}</TableCell>
                    <TableCell>{instagramLayout.title}</TableCell>
                    <TableCell>{instagramLayout.footer}</TableCell>
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`${paths.adminContent.home.instagram}/${instagramLayout.id}`}
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
        count={instagramLayoutsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Sliders por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
      <InstagramLayoutDeleteConfirmModal
        open={open}
        onClose={closeDeleteModal}
        onConfirm={removeSelected}
      />
    </Box>
  );
};

InstagramLayoutListTable.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  instagramLayouts: PropTypes.array.isRequired,
  instagramLayoutsCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

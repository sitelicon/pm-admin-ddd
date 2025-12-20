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
import { ButtonDeleteConfirmModal } from './button-delete-confirm-modal';
import { TablePaginationActions } from '../../components/table-pagination-actions';
import { useSelectionModel } from '../../hooks/use-selection-model';

export const ButtonListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    buttons,
    buttonsCount,
    page,
    perPage,
    loading,
    handleRemove,
    ...other
  } = props;

  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(buttons);

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

  const selectedAll = selected.length === buttons.length;
  const selectedSome = selected.length > 0 && selected.length < buttons.length;
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
              <TableCell>Id #</TableCell>
              <TableCell>Titulo</TableCell>
              <TableCell>Url</TableCell>
              <TableCell>Tipo</TableCell>
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
                    <Skeleton
                      variant="rectangular"
                      width={40}
                      height={40}
                      sx={{
                        bbuttonRadius: 1,
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
              buttons.map((button) => {
                const isSelected = selected.includes(button.id);
                return (
                  <TableRow hover key={button.id} sx={{ cursor: 'pointer' }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          const { checked } = event.target;
                          if (checked) {
                            selectOne(button.id);
                          } else {
                            deselectOne(button.id);
                          }
                        }}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell>{button.id}</TableCell>
                    <TableCell>{button.title}</TableCell>
                    <TableCell>{button.url}</TableCell>
                    <TableCell align="center">
                      {button.type === 'button' && (
                        <button
                          type="button"
                          href={button.url}
                          style={{
                            border: '1px solid black',
                            textAlign: 'center',
                            backgroundColor: 'white',
                            color: 'black',
                            lineHeight: '1.25rem',
                            padding: '0.5rem 1rem',
                            margin: '0',
                            fontWeight: 500,
                            fontSize: '1rem',
                          }}
                        >
                          BUTTON
                        </button>
                      )}
                      {button.type === 'link' && (
                        <a
                          href={button.url}
                          style={{
                            fontWeight: 500,
                            fontSize: '1rem',
                            borderRadius: '0px',
                            lineHeight: '1.25rem',
                            padding: '0.5rem 0',
                            margin: '0',
                            cursor: 'pointer',
                            color: 'black',
                            textUnderlineOffset: '0.25rem',
                            textDecoration: 'underline',
                            textDecorationThickness: '0.125rem',
                          }}
                        >
                          LINK
                        </a>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`${paths.adminContent.home.buttons}/${button.id}`}
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
        count={buttonsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={perPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="Elementos por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={TablePaginationActions}
      />
      <ButtonDeleteConfirmModal
        open={open}
        onClose={closeDeleteModal}
        onConfirm={removeSelected}
      />
    </Box>
  );
};

ButtonListTable.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  buttons: PropTypes.array.isRequired,
  buttonsCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

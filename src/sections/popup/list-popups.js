import { useCallback } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
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
import { helpCenterApi } from '../../api/help-center';
import { popupsApi } from '../../api/popups';

const tenants = [
  { id: 1, label: '🇪🇸 Español' },
  { id: 2, label: '🇬🇧 Inglés' },
  { id: 3, label: '🇫🇷 Francés' },
  { id: 4, label: '🇵🇹 Portugués' },
  { id: 5, label: '🇮🇹 Italiano' },
  { id: 6, label: '🇩🇪 Alemán' },
  { id: 7, label: '🇵🇹(M)' },
];

export const PopUpList = ({ items, columns, loading, refetch, ...other }) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(items);
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
  const selectedAll = selected.length === items.length;
  const selectedSome = selected.length > 0 && selected.length < items.length;
  const enableBulkActions = selected.length > 0;

  const deleteItem = async (id) => {
    try {
      const response = await popupsApi.deletePopUp(id);
      if (response) {
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
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
          <Button
            color="error"
            size="small"
            onClick={() => {
              selected.forEach((id) => deleteItem(id));
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
              <TableCell>Titulo</TableCell>
              <TableCell>Visibilidad</TableCell>
              <TableCell>Idioma</TableCell>
              <TableCell>Desde</TableCell>
              <TableCell>Hasta</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Path</TableCell>
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
                  {Array.from(Array(6)).map((_, index) => (
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
            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron resultados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              items.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                  <TableRow key={item.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            deselectOne(item.id);
                          } else {
                            selectOne(item.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      {item.is_active ? (
                        <Chip label="VISIBLE" color="success" />
                      ) : (
                        <Chip label="NO VISIBLE" color="default" />
                      )}
                    </TableCell>
                    <TableCell>
                      {
                        tenants.find((tenant) => {
                          return tenant.id === item.language_id;
                        }).label
                      }
                    </TableCell>
                    <TableCell>{`${new Date(item.from).toLocaleDateString(
                      'es-ES',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      },
                    )}, ${new Date(item.from).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}`}</TableCell>
                    <TableCell>{`${new Date(item.to).toLocaleDateString(
                      'es-ES',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      },
                    )}, ${new Date(item.to).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}`}</TableCell>
                    <TableCell>
                      {item.source_desktop && item.source_mobile && (
                        <Typography variant="body2" color="text.primary">
                          Con imágenes
                        </Typography>
                      )}
                      {!item.source_desktop && item.source_mobile && (
                        <Typography variant="body2" color="text.secondary">
                          Falta imagen escritorio
                        </Typography>
                      )}
                      {item.source_desktop && !item.source_mobile && (
                        <Typography variant="body2" color="text.secondary">
                          Falta imagen móvil
                        </Typography>
                      )}
                      {!item.source_desktop && !item.source_mobile && (
                        <Typography variant="body2" color="text.secondary">
                          Sin archivos
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>pacomartinez.com{item.path}</TableCell>
                    <TableCell align="center">
                      <Link
                        component={NextLink}
                        href={`/popups/${item.id}`}
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

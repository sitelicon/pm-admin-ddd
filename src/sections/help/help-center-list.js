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

const tenants = [
  { id: 1, label: '🇪🇸 Español', store: '🇪🇸 España' },
  { id: 2, label: '🇬🇧 Inglés', store: '🇬🇧 Inglaterra' },
  { id: 3, label: '🇫🇷 Francés', store: '🇫🇷 Francia' },
  { id: 4, label: '🇵🇹 Portugués', store: '🇵🇹 Portugal' },
  { id: 5, label: '🇮🇹 Italiano', store: '🇮🇹 Italia' },
  { id: 6, label: '🇩🇪 Alemán', store: '🇵🇹 Madeira' }, // Error de consistencia de datos. El lenguaje 6 es alemán pero es la tienda de Madeira
  { id: 7, label: '🇵🇹 Portugal-Madeira', store: null }, // Error de consistencia de datos, El lenguaje 7 es Portugues-Madeira, pero no existe la tienda.
  // El lenaguaje 7 debería existir pero no existe. Por lo que no se le asigna ninguna tienda.
];

export const HelpCenterList = ({
  items,
  columns,
  loading,
  refetch,
  ...other
}) => {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelectionModel(items);
  const itemsOrdered = items.sort((a, b) => a.order - b.order);
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
      const response = await helpCenterApi.deleteHelpCenter(id);
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
              <TableCell>Orden</TableCell>
              <TableCell>Icono</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Idioma</TableCell>
              <TableCell align="center">Visibilidad</TableCell>
              <TableCell align="center">Path</TableCell>
              <TableCell align="center">Nº Items</TableCell>
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
            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron resultados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              itemsOrdered.map((item) => {
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
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      {item.icon !== null ? (
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={30}
                          height={30}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin icono
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{item.title ?? item.title}</TableCell>
                    <TableCell>
                      {
                        tenants.find((tenant) => {
                          return tenant.id === item.store_id;
                        }).store
                      }
                    </TableCell>
                    <TableCell>
                      {
                        tenants.find((tenant) => {
                          return tenant.id === item.language_id;
                        }).label
                      }
                    </TableCell>
                    <TableCell>
                      {item.is_active ? (
                        <Chip label="VISIBLE" color="success" />
                      ) : (
                        <Chip label="NO VISIBLE" color="default" />
                      )}
                    </TableCell>
                    <TableCell>
                      pacomartinez.com{item.slug ?? item.slug}
                    </TableCell>
                    <TableCell>{item.items.length}</TableCell>
                    <TableCell align="center">
                      <Link
                        component={NextLink}
                        href={`/help/${item.id}`}
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

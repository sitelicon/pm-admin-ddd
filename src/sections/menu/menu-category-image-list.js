import NextLink from 'next/link';
import {
  Box,
  Button,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  MenuItem,
  Skeleton,
  Stack,
  SvgIcon,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Telescope } from '@untitled-ui/icons-react';
import { Scrollbar } from '../../components/scrollbar';
import { useMemo } from 'react';
import { tenants } from '../../utils/tenants';

export const CategoryImageList = ({ columns, categories, loading }) => {
  const categoriesImages = useMemo(() => {
    return categories.map((category) => {
      return {
        id: category.id,
        name: category.name,
        category_id: category.category_id,
        language_id: category.language_id,
      };
    });
  }, [categories]);
  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="1px" align="center">
                <Checkbox disabled />
              </TableCell>
              <TableCell width="1px" align="center">
                #ID
              </TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Tienda</TableCell>
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
            {!loading && categoriesImages?.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 3} align="center">
                  <Stack alignItems="center" spacing={2} sx={{ p: 4 }}>
                    <SvgIcon fontSize="large" color="disabled">
                      <Telescope />
                    </SvgIcon>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron categorías del menú con imágenes.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              categoriesImages?.length > 0 &&
              categoriesImages?.map((item) => {
                const isSelected = false;
                return (
                  <TableRow key={item.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {}}
                        value={isSelected}
                      />
                    </TableCell>
                    <TableCell width="1px">
                      <Stack
                        direction="row"
                        alignContent="center"
                        justifyContent="center"
                      >
                        #{item.id}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Link
                        component={NextLink}
                        href={`/menu/${item.category_id}/${item.id}`}
                        color="primary"
                        variant="caption"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        alignContent="center"
                        justifyContent="left"
                      >
                        {
                          tenants.find(
                            (tenant) => tenant.id === item.language_id,
                          ).label
                        }
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Link
                        component={NextLink}
                        href={`/menu/${item.category_id}/${item.id}`}
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

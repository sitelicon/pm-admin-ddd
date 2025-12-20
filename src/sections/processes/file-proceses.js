import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Scrollbar } from '../../components/scrollbar';
import { processesApi } from '../../api/processes';
import { useMemo, useState } from 'react';
import { CloudUpload } from '@mui/icons-material';
import { Stack } from '@mui/system';
import toast from 'react-hot-toast';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const useUploadHook = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState('');

  const handleUpload = async () => {
    setLoading(true);
    try {
      await processesApi.uploadFileToS3(path, file).then((response) => {
        if (response.status === 200) {
          toast.success('Archivo subido correctamente');
          setFile(null);
          setPath('');
        }
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al subir el archivo:' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const disabled = useMemo(
    () => !path || !file || loading,
    [path, file, loading],
  );

  return {
    file,
    setFile,
    loadingUpload: loading,
    path,
    setPath,
    handleUpload,
    disabledUpload: disabled,
  };
};

export const FileProcessesTable = (props) => {
  const {
    file,
    setFile,
    path,
    loadingUpload,
    setPath,
    handleUpload,
    disabledUpload,
  } = useUploadHook();

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingStock, setUpdatingStock] = useState(false);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdatingStatus(true);
    try {
      await processesApi.updateStatus().then(() => {
        toast.success('Estado actualizado correctamente');
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el estado:' + error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    setUpdatingStock(true);
    try {
      await processesApi.updateStock().then((response) => {
        toast.success('Estado actualizado correctamente');
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el stock:' + error.message);
    } finally {
      setUpdatingStock(false);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Descripción</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={process.id} hover>
              <TableCell align="center">
                <Typography color="text.primary" variant="caption">
                  Subir archivo EXCEL
                </Typography>
              </TableCell>

              <TableCell align="center" colSpan={2}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent={'end'}
                >
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload />}
                  >
                    {file ? file.name : 'Subir archivo'}
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => setFile(event.target.files[0])}
                      multiple
                    />
                  </Button>
                  <Select
                    value={path}
                    onChange={(event) => setPath(event.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" selected>
                      Selecciona una opción
                    </MenuItem>
                    <MenuItem value="stock">Stock</MenuItem>
                    <MenuItem value="status">Pedidos</MenuItem>
                  </Select>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={disabledUpload}
                    onClick={handleUpload}
                  >
                    {loadingUpload ? 'Subiendo...' : 'Subir archivo'}
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow key={process.id} hover>
              <TableCell align="center">
                <Typography color="text.primary" variant="caption">
                  Actualizar status de pedidos
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="text.primary" variant="caption">
                  Actualizar el estado de los pedidos de los clientes que se
                  hayan subido en el archivo
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                >
                  {updatingStatus ? 'Actualizando...' : 'Actualizar estado'}
                </Button>
              </TableCell>
            </TableRow>
            <TableRow key={process.id} hover>
              <TableCell align="center">
                <Typography color="text.primary" variant="caption">
                  Actualizar stock
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography color="text.primary" variant="caption">
                  Actualizar el stock de los productos que se hayan subido en el
                  archivo
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleUpdateStock}
                  disabled={updatingStock}
                >
                  {updatingStock ? 'Actualizando...' : 'Actualizar stock'}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};

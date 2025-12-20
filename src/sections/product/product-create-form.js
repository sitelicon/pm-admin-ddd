import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { FileDropzone } from '../../components/file-dropzone';
import { QuillEditor } from '../../components/quill-editor';
import { paths } from '../../paths';

const categoryOptions = [
  {
    label: 'Healthcare',
    value: 'healthcare',
  },
  {
    label: 'Makeup',
    value: 'makeup',
  },
  {
    label: 'Dress',
    value: 'dress',
  },
  {
    label: 'Skincare',
    value: 'skincare',
  },
  {
    label: 'Jewelry',
    value: 'jewelry',
  },
  {
    label: 'Blouse',
    value: 'blouse',
  },
];

const initialValues = {
  barcode: '925487986526',
  category: '',
  description: '',
  images: [],
  name: '',
  newPrice: 0,
  oldPrice: 0,
  sku: '',
  submit: null,
};

const validationSchema = Yup.object({
  barcode: Yup.string().max(
    255,
    'El código de barras no puede tener más de 255 caracteres',
  ),
  category: Yup.string().max(
    255,
    'La categoría no puede tener más de 255 caracteres',
  ),
  description: Yup.string().max(
    5000,
    'La descripción no puede tener más de 5000 caracteres',
  ),
  images: Yup.array(),
  name: Yup.string()
    .max(255, 'El nombre no puede tener más de 255 caracteres')
    .required('El nombre es obligatorio'),
  newPrice: Yup.number().min(0, 'El precio no puede ser negativo').required(),
  oldPrice: Yup.number().min(0, 'El precio no puede ser negativo'),
  sku: Yup.string().max(255, 'El SKU no puede tener más de 255 caracteres'),
});

export const ProductCreateForm = (props) => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        toast.success('Product created');
        router.push(paths.products.index);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleFileRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

  return (
    <form onSubmit={formik.handleSubmit} {...props}>
      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Typography variant="h6">Detalles básicos</Typography>
              </Grid>
              <Grid xs={12} md={8}>
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    label="Nombre del producto"
                    name="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  <TextField
                    error={!!(formik.touched.sku && formik.errors.sku)}
                    fullWidth
                    label="SKU"
                    name="sku"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.sku}
                  />
                  <div>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 2 }}
                      variant="subtitle2"
                    >
                      Descripción
                    </Typography>
                    <QuillEditor
                      onChange={(value) => {
                        formik.setFieldValue('description', value);
                      }}
                      placeholder="Descripción del producto"
                      sx={{ height: 400 }}
                      value={formik.values.description}
                    />
                    {!!(
                      formik.touched.description && formik.errors.description
                    ) && (
                      <Box sx={{ mt: 2 }}>
                        <FormHelperText error>
                          {formik.errors.description}
                        </FormHelperText>
                      </Box>
                    )}
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="h6">Imágenes</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Las imágenes aparecerán en el escaparate de su sitio web.
                  </Typography>
                </Stack>
              </Grid>
              <Grid xs={12} md={8}>
                <FileDropzone
                  accept={{ 'image/*': [] }}
                  caption="(SVG, JPG, PNG, o GIF máximo 900x400)"
                  files={files}
                  onDrop={handleFilesDrop}
                  onRemove={handleFileRemove}
                  onRemoveAll={handleFilesRemoveAll}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Typography variant="h6">Precios</Typography>
              </Grid>
              <Grid xs={12} md={8}>
                <Stack spacing={3}>
                  <TextField
                    error={
                      !!(formik.touched.oldPrice && formik.errors.oldPrice)
                    }
                    fullWidth
                    label="Antiguo precio"
                    name="oldPrice"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.oldPrice}
                  />
                  <TextField
                    error={
                      !!(formik.touched.newPrice && formik.errors.newPrice)
                    }
                    fullWidth
                    label="Nuevo precio"
                    name="newPrice"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.newPrice}
                  />
                  <div>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Seguir vendiendo cuando el producto esté agotado"
                    />
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Typography variant="h6">Categoría</Typography>
              </Grid>
              <Grid xs={12} md={8}>
                <Stack spacing={3}>
                  <TextField
                    error={
                      !!(formik.touched.category && formik.errors.category)
                    }
                    fullWidth
                    label="Categoría"
                    name="category"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    select
                    value={formik.values.category}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    disabled
                    error={!!(formik.touched.barcode && formik.errors.barcode)}
                    fullWidth
                    label="Barcode"
                    name="barcode"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.barcode}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
          spacing={1}
        >
          <Button color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained">
            Crear producto
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

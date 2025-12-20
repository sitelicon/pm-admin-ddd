import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  IconButton,
  Link,
  Skeleton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ChevronDown, ChevronRight, Pencil02 } from '@untitled-ui/icons-react';
import { categoriesApi } from '../../api/categories';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { useMounted } from '../../hooks/use-mounted';
import { usePageView } from '../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { Scrollbar } from '../../components/scrollbar';
import { useLanguageId } from '../../hooks/use-language-id';
import { SeverityPill } from '../../components/severity-pill';

const CategoryListRow = ({ category, parentNames = [] }) => {
  const languageId = useLanguageId();
  const [open, setOpen] = useState(false);
  const hasChildren = useMemo(() => category.children.length > 0, [category]);
  const data = useMemo(
    () => category.data.find(({ language_id }) => language_id === languageId),
    [category.data, languageId],
  );

  return (
    <>
      <TableRow
        hover
        selected={open}
        sx={{
          ...(open && {
            backgroundColor: 'rgba(17, 25, 39, 0.04)',
          }),
        }}
      >
        <TableCell
          padding="checkbox"
          sx={{
            position: 'relative',
            paddingLeft: `${category.level * 30}px !important`,
          }}
        >
          {hasChildren && (
            <IconButton onClick={() => setOpen((prev) => !prev)}>
              <SvgIcon fontSize="small">
                {open ? <ChevronDown /> : <ChevronRight />}
              </SvgIcon>
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <Box
            sx={{ cursor: 'pointer', ml: 2, userSelect: 'none' }}
            onClick={() => setOpen((prev) => !prev)}
          >
            {parentNames.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize={11}
              >
                {parentNames.join(' → ')}
              </Typography>
            )}
            {data?.name ? (
              <Typography
                variant="subtitle2"
                sx={{ textTransform: 'uppercase' }}
              >
                {data?.name}
              </Typography>
            ) : (
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontStyle="italic"
              >
                Nombre sin definir
              </Typography>
            )}
          </Box>
        </TableCell>
        <TableCell align="center">
          {category.erp_id || (
            <Typography
              variant="caption"
              color="text.secondary"
              fontStyle="italic"
            >
              N/A
            </Typography>
          )}
        </TableCell>
        <TableCell align="center">{category.position}</TableCell>
        <TableCell align="center">{category.children.length}</TableCell>
        <TableCell align="center">
          <SeverityPill
            color={category.stores?.length > 0 ? 'success' : 'error'}
          >
            {category.stores?.length > 0 ? 'Habilitado' : 'Deshabilitado'}
          </SeverityPill>
        </TableCell>
        <TableCell align="right">
          <Button
            size="small"
            LinkComponent={NextLink}
            href={`/categories-images/${category.id}`}
            sx={{ whiteSpace: 'nowrap' }}
            startIcon={
              <SvgIcon fontSize="inherit">
                <Pencil02 />
              </SvgIcon>
            }
          >
            Editar
          </Button>
        </TableCell>
      </TableRow>
      {open &&
        category.children.map((child) => (
          <CategoryListRow
            key={child.id}
            category={child}
            isChild={true}
            parentNames={[...parentNames, data?.name]}
          />
        ))}
    </>
  );
};

const useCategories = (search) => {
  const isMounted = useMounted();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getCategories(search);

      if (isMounted()) {
        setCategories(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, isMounted]);

  useEffect(
    () => {
      getCategories();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    categories,
    loading,
    setCategories,
    refetch: () => getCategories(),
  };
};

const CategoryList = () => {
  const { categories, loading } = useCategories();

  usePageView();

  return (
    <>
      <Head>
        <title>Listado de categorías-imágenes | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">
                  Listado de categorías imágenes
                </Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.index}
                    variant="subtitle2"
                  >
                    Inicio
                  </Link>
                  <Link
                    color="text.primary"
                    component={NextLink}
                    href={paths.categories_images.index}
                    variant="subtitle2"
                  >
                    Categorías
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <Card>
              <Scrollbar>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" />
                      <TableCell>Categoría</TableCell>
                      <TableCell align="center">ERP ID</TableCell>
                      <TableCell align="center">Posición</TableCell>
                      <TableCell align="center">Categorías hijas</TableCell>
                      <TableCell align="center">Estado</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && (
                    <TableBody>
                      {categories.map((category, index) => (
                        <CategoryListRow
                          key={category.id}
                          category={category}
                        />
                      ))}
                    </TableBody>
                  )}
                  {loading &&
                    Array.from(Array(10).keys()).map((i) => (
                      <TableRow key={i}>
                        <TableCell padding="checkbox" />
                        {Array.from(Array(6).keys()).map((i) => (
                          <TableCell key={i}>
                            <Skeleton variant="text" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </Table>
              </Scrollbar>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

CategoryList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CategoryList;

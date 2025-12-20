import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { notFound } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Link,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { Image01 } from '@untitled-ui/icons-react';
import { usePageView } from '../../hooks/use-page-view';
import { productsApi } from '../../api/products';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { paths } from '../../paths';
import { ProductAttributes } from '../../sections/product/product-attributes';
import { SeverityPill } from '../../components/severity-pill';
import { ProductImages } from '../../sections/product/product-images';
import { ProductPrices } from '../../sections/product/product-prices';
import { useLanguageId } from '../../hooks/use-language-id';
import { ProductGroups } from '../../sections/product/product-groups';
import { useAuth } from '../../hooks/use-auth';

const useProduct = (productId) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectOptions, setSelectOptions] = useState(undefined);
  const [error, setError] = useState(undefined);

  const getProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsApi.getProduct(productId);
      setProduct({
        ...response.product,
        groups_reduced: response.groups_reduced,
      });
      setSelectOptions(response.selectOptions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(
    () => {
      getProduct();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productId],
  );

  return {
    loading,
    product,
    selectOptions,
    error,
    refetch: getProduct,
  };
};

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const languageId = useLanguageId();
  const { productId } = router.query;
  const { loading, product, selectOptions, error, refetch } =
    useProduct(productId);
  const [currentTab, setCurrentTab] = useState('attributes');
  const [loadingDeletes, setLoadingDeletes] = useState(false);
  const handleDeletingProduct = async () => {
    try {
      if (
        window.confirm('¿Estás seguro de que quieres eliminar este producto?')
      ) {
        setLoadingDeletes(true);
        await productsApi.deleteProduct(productId);
        toast.success('Producto eliminado');
        refetch();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDeletes(false);
    }
  };

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const tabs = useMemo(() => {
    return [
      {
        label: 'Atributos',
        value: 'attributes',
      },
      {
        label: 'Imágenes',
        value: 'images',
        counter: product?.images?.length || '0',
      },
      {
        label: 'Precios',
        value: 'prices',
        counter: product?.prices?.length || '0',
      },
      {
        label: 'Agrupaciones',
        value: 'groups',
        counter: product?.groups?.length
          ? new Set(product.groups.map((group) => group.product_group_type_id))
              .size
          : 0,
      },
    ];
  }, [product]);

  const mainImage = product?.images.find((image) => image.tag === 'PRINCIPAL');

  const name = useMemo(
    () =>
      product?.names?.find(({ language_id }) => language_id === languageId)
        ?.value || '',
    [product?.names, languageId],
  );

  const isActive = useMemo(() => {
    if (!product) return false;
    if (product.draft) return false;
    if (product.stores?.length === 0) return false;
    return true;
  }, [product]);

  if (loading) {
    return null;
  }

  if (error || !product) {
    return notFound();
  }

  return (
    <>
      <Head>
        <title>Producto: {name || 'Cargando…'} | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ pr: 1 }}>
                  {mainImage ? (
                    <Box
                      sx={{
                        alignItems: 'center',
                        backgroundColor: 'neutral.50',
                        backgroundImage: `url(${mainImage.url})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        borderRadius: 1,
                        display: 'flex',
                        height: 100,
                        justifyContent: 'center',
                        overflow: 'hidden',
                        width: 100,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        alignItems: 'center',
                        backgroundColor: 'neutral.50',
                        borderRadius: 1,
                        display: 'flex',
                        height: 100,
                        justifyContent: 'center',
                        width: 100,
                      }}
                    >
                      <SvgIcon>
                        <Image01 />
                      </SvgIcon>
                    </Box>
                  )}
                </Box>
                <Stack spacing={1}>
                  <Typography variant="h5">{name}</Typography>
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
                      href={paths.products.index}
                      variant="subtitle2"
                    >
                      Productos
                    </Link>
                    <Typography color="text.secondary" variant="subtitle2">
                      Editar producto
                    </Typography>
                  </Breadcrumbs>
                </Stack>
              </Stack>
              <div>
                {product.deleted_at !== null ? (
                  <SeverityPill color="error" sx={{ py: 1, px: 3 }}>
                    Producto eliminado
                  </SeverityPill>
                ) : (
                  <SeverityPill
                    color={!isActive ? 'warning' : 'success'}
                    sx={{ py: 1, px: 3 }}
                  >
                    {!isActive ? 'Deshabilitado' : 'Habilitado'}
                  </SeverityPill>
                )}
              </div>
            </Stack>
            <Stack spacing={1} style={{ width: '100%' }}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                  >
                    {tabs.map((tab) => (
                      <Tab
                        key={tab.value}
                        label={
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Typography variant="subtitle2">
                              {tab.label}
                            </Typography>
                            {!!tab.counter && (
                              <Chip
                                label={tab.counter}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: '0.75rem',
                                  color: 'text.secondary',
                                }}
                              />
                            )}
                          </Stack>
                        }
                        value={tab.value}
                        sx={{ py: 1, minHeight: '50px' }}
                      />
                    ))}
                  </Tabs>
                  <Divider />
                </Box>
                {product.deleted_at === null && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDeletingProduct}
                    disabled={loadingDeletes || !user.role.can_edit}
                  >
                    {loadingDeletes ? 'Eliminando…' : 'Eliminar'}
                  </Button>
                )}
              </Stack>
            </Stack>
            {currentTab === 'attributes' && (
              <ProductAttributes
                product={product}
                selectOptions={selectOptions}
                refetch={refetch}
              />
            )}
            {currentTab === 'images' && (
              <ProductImages product={product} refetch={refetch} />
            )}
            {currentTab === 'prices' && (
              <ProductPrices product={product} refetch={refetch} />
            )}
            {currentTab === 'groups' && (
              <ProductGroups product={product} refetch={refetch} />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

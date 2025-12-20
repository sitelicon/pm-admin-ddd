import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { processesApi } from '../../api/processes';
import { BreadcrumbsSeparator } from '../../components/breadcrumbs-separator';
import { Layout as DashboardLayout } from '../../layouts/dashboard';
import { paths } from '../../paths';
import { ProcessesListTable } from '../../sections/processes/processes-list-table';
import { FileProcessesTable } from '../../sections/processes/file-proceses';

const useProcesses = () => {
  const [state, setState] = useState({
    processes: [],
    processesCount: 0,
    loading: true,
  });

  const getProcesses = useCallback(async () => {
    try {
      const response = await processesApi.getProcesses();

      setState({
        processes: response.items,
        processesCount: response.items.lenght,
        loading: false,
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    getProcesses();
  }, [getProcesses]);

  return state;
};

const ProcessesList = () => {
  const { processes, processesCount, loading } = useProcesses();

  return (
    <>
      <Head>
        <title>Listado de procesos | PACOMARTINEZ</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h5">Listado de procesos</Typography>
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
                    Procesos
                  </Link>
                  <Typography color="text.secondary" variant="subtitle2">
                    Listado
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <Divider />
            <Card>
              <ProcessesListTable
                processes={processes}
                processesCount={processesCount}
                loading={loading}
              />
            </Card>
            <Card>
              <FileProcessesTable />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

ProcessesList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProcessesList;

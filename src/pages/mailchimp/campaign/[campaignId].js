import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import {
  Box,
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
import { usePageView } from '../../../hooks/use-page-view';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { paths } from '../../../paths';
import { mailchimpApi } from '../../../api/mailchimp';
import { CampaignsDetails } from '../../../sections/mailchimp/campaigns-details';

const tabs = [{ label: 'Detalles', value: 'details' }];

const useCampaign = (campaignId) => {
  const [state, setState] = useState({
    campaign: null,
    loading: true,
  });

  const getCampaign = useCallback(async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const response = await mailchimpApi.getCampaign(campaignId);
      setState({
        campaign: response.response ?? response,
        loading: false,
      });
    } catch (error) {
      console.error(error);
    }
  }, [campaignId]);

  useEffect(() => {
    getCampaign(campaignId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  return {
    campaign: state.campaign,
    loading: state.loading,
  };
};

const Page = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const [currentTab, setCurrentTab] = useState('details');
  const { campaign, loading } = useCampaign(campaignId);
  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  if (!campaign) {
    return null;
  }

  if (loading) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Detalles de campaña | PACOMARTINEZ</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack spacing={2}>
              <div>
                <Link
                  color="text.primary"
                  component={NextLink}
                  href={paths.mailchimp.index}
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                  }}
                  underline="hover"
                >
                  <SvgIcon sx={{ mr: 1 }}>
                    <ArrowLeftIcon />
                  </SvgIcon>
                  <Typography variant="subtitle2">
                    Volver al listado de campañas
                  </Typography>
                </Link>
              </div>
              <Stack
                alignItems="flex-start"
                direction={{
                  xs: 'column',
                  md: 'row',
                }}
                justifyContent="space-between"
                spacing={4}
              >
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Stack spacing={1}>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <Typography variant="h5">
                        {campaign.settings.title}
                      </Typography>
                      <Chip label={campaign.id} size="small" />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              <div>
                <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  sx={{ mt: 1 }}
                  textColor="primary"
                  value={currentTab}
                  variant="scrollable"
                >
                  {tabs.map((tab) => (
                    <Tab key={tab.value} label={tab.label} value={tab.value} />
                  ))}
                </Tabs>
                <Divider />
              </div>
            </Stack>
            {currentTab === 'details' && (
              <CampaignsDetails campaign={campaign} />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

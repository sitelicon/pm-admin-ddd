import { useEffect } from 'react';
import Head from 'next/head';
import { Provider as ReduxProvider } from 'react-redux';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import numeral from 'numeral';
import { RTL } from '../components/rtl';
import { SplashScreen } from '../components/splash-screen';
// import { SettingsButton } from '../components/settings-button';
import { SettingsDrawer } from '../components/settings-drawer';
import { Toaster } from '../components/toaster';
import {
  SettingsConsumer,
  SettingsProvider,
} from '../contexts/settings-context';
import { AuthConsumer, AuthProvider } from '../contexts/auth/jwt-context';
import { gtmConfig } from '../config';
import { gtm } from '../libs/gtm';
import { store } from '../store';
import { createTheme } from '../theme';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { PermissionGuard } from '../guards/permission-guard';
// Remove if react-quill is not used
import 'react-quill/dist/quill.snow.css';
// Remove if react-draft-wysiwyg is not used
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// Remove if simplebar is not used
import 'simplebar/dist/simplebar.min.css';
// Remove if mapbox is not used
import 'mapbox-gl/dist/mapbox-gl.css';
// Import react-date-range styles
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
// Remove if nprogress is not used
import '../libs/nprogress';
// Remove if locales are not used
import '../locales/i18n';
import '../styles.css';

// Register ES locale for numeral.js
if (numeral.locales['pacomartinez'] === undefined) {
  numeral.register('locale', 'pacomartinez', {
    delimiters: {
      thousands: '.',
      decimal: ',',
    },
    abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't',
    },
    ordinal: function (number) {
      var b = number % 10;
      return b === 1 || b === 3
        ? 'er'
        : b === 2
        ? 'do'
        : b === 7 || b === 0
        ? 'mo'
        : b === 8
        ? 'vo'
        : b === 9
        ? 'no'
        : 'to';
    },
    currency: {
      symbol: '€',
    },
  });
}

// Switch locale for numeral.js
numeral.locale('pacomartinez');

const clientSideEmotionCache = createEmotionCache();

const useAnalytics = () => {
  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);
};

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useAnalytics();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>PACOMARTINEZ</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <AuthConsumer>
              {(auth) => (
                <SettingsProvider>
                  <SettingsConsumer>
                    {(settings) => {
                      // Prevent theme flicker when restoring custom settings from browser storage
                      if (!settings.isInitialized) {
                        // return null;
                      }

                      const theme = createTheme({
                        colorPreset: settings.colorPreset,
                        contrast: settings.contrast,
                        direction: settings.direction,
                        paletteMode: settings.paletteMode,
                        responsiveFontSizes: settings.responsiveFontSizes,
                      });

                      // Prevent guards from redirecting
                      const showSlashScreen = !auth.isInitialized;

                      return (
                        <ThemeProvider theme={theme}>
                          <Head>
                            <meta
                              name="color-scheme"
                              content={settings.paletteMode}
                            />
                            <meta
                              name="theme-color"
                              content={theme.palette.neutral[900]}
                            />
                          </Head>
                          <RTL direction={settings.direction}>
                            <CssBaseline />
                            {showSlashScreen ? (
                              <SplashScreen />
                            ) : (
                              <>
                                {getLayout(<Component {...pageProps} />)}
                                {/* <PermissionGuard>
                                  <SettingsButton
                                    onClick={settings.handleDrawerOpen}
                                  />
                                  <SettingsDrawer
                                    canReset={settings.isCustom}
                                    onClose={settings.handleDrawerClose}
                                    onReset={settings.handleReset}
                                    onUpdate={settings.handleUpdate}
                                    open={settings.openDrawer}
                                    values={{
                                      colorPreset: settings.colorPreset,
                                      contrast: settings.contrast,
                                      direction: settings.direction,
                                      paletteMode: settings.paletteMode,
                                      responsiveFontSizes:
                                        settings.responsiveFontSizes,
                                      stretch: settings.stretch,
                                      layout: settings.layout,
                                      navColor: settings.navColor,
                                    }}
                                  />
                                </PermissionGuard> */}
                              </>
                            )}
                            <Toaster />
                          </RTL>
                        </ThemeProvider>
                      );
                    }}
                  </SettingsConsumer>
                </SettingsProvider>
              )}
            </AuthConsumer>
          </AuthProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default App;

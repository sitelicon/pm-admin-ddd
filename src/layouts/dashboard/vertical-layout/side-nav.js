import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { Drawer, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Scrollbar } from '../../../components/scrollbar';
import { TenantSwitch } from '../tenant-switch';
import { SideNavSection } from './side-nav-section';
import { useAuth } from '../../../hooks/use-auth';

const SIDE_NAV_WIDTH = 280;

const useCssVars = (color) => {
  const theme = useTheme();

  return useMemo(() => {
    switch (color) {
      case 'discreet':
        if (theme.palette.mode === 'dark') {
          return {
            '--nav-bg': '#111827', // Gray 900
            '--nav-color': '#f3f4f6', // Gray 100
            '--nav-border-color': '#374151', // Gray 700
            '--nav-logo-border': '#374151',
            '--nav-section-title-color': '#9ca3af', // Gray 400
            '--nav-item-color': '#9ca3af',
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': '#ffffff',
            '--nav-item-disabled-color': '#4b5563',
            '--nav-item-icon-color': '#6b7280',
            '--nav-item-icon-active-color': '#10b981', // Emerald (tu acento)
            '--nav-item-icon-disabled-color': '#374151',
            '--nav-item-chevron-color': '#6b7280',
            '--nav-scrollbar-color': '#4b5563',
          };
        } else {
          // --- MODO CLARO (Tu estilo principal) ---
          return {
            '--nav-bg': '#ffffff', // Blanco puro, sin puntos
            '--nav-color': '#111827', // Gray 900 (Casi negro)
            '--nav-border-color': '#e5e7eb', // Gray 200 (El mismo borde que las cards)
            '--nav-logo-border': '#e5e7eb',
            '--nav-section-title-color': '#6b7280', // Gray 500
            '--nav-item-color': '#6b7280', // Gray 500
            '--nav-item-hover-bg': '#f9fafb', // Gray 50 (Sutil al pasar el ratón)
            '--nav-item-active-bg': '#f3f4f6', // Gray 100 (Sutil al estar activo)
            '--nav-item-active-color': '#000000', // Negro puro al estar activo
            '--nav-item-disabled-color': '#9ca3af',
            '--nav-item-icon-color': '#9ca3af', // Gray 400
            '--nav-item-icon-active-color': '#000000', // Icono negro al estar activo
            '--nav-item-icon-disabled-color': '#d1d5db',
            '--nav-item-chevron-color': '#9ca3af',
            '--nav-scrollbar-color': '#d1d5db',
          };
        }

      default:
        return {
          '--nav-bg': '#ffffff',
          '--nav-color': '#111827',
          '--nav-border-color': '#e5e7eb',
        };
    }
  }, [theme, color]);
};

export const SideNav = (props) => {
  const { color = 'discreet', sections = [] } = props;
  const pathname = usePathname();
  const cssVars = useCssVars(color);
  const { user } = useAuth();

  return (
    <Drawer
      anchor="left"
      open
      PaperProps={{
        sx: {
          ...cssVars,
          backgroundColor: 'var(--nav-bg)',
          borderRightColor: 'var(--nav-border-color)',
          borderRightStyle: 'solid',
          borderRightWidth: 1,
          color: 'var(--nav-color)',
          width: SIDE_NAV_WIDTH,
          boxShadow: 'none',
        },
      }}
      variant="permanent"
    >
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%',
          },
          '& .simplebar-scrollbar:before': {
            background: 'var(--nav-scrollbar-color)',
          },
        }}
      >
        <Stack sx={{ height: '100%' }}>
          <Stack alignItems="center" direction="row" spacing={2} sx={{ p: 3 }}>
            <TenantSwitch sx={{ flexGrow: 1 }} />
          </Stack>
          <Stack
            component="nav"
            spacing={2}
            sx={{
              flexGrow: 1,
              px: 2,
              pb: 3,
            }}
          >
            {sections
              .map((section) => ({
                ...section,
                items: section.items.filter((item) =>
                  user?.role?.menus?.some((menu) => menu.code === item.title),
                ),
              }))
              .filter((section) => section.items.length > 0)
              .map((section, index) => (
                <SideNavSection
                  items={section.items}
                  key={index}
                  pathname={pathname}
                  subheader={section.subheader}
                />
              ))}
          </Stack>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

SideNav.propTypes = {
  color: PropTypes.oneOf(['blend-in', 'discreet', 'evident']),
  sections: PropTypes.array,
};

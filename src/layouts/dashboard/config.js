import { SvgIcon } from '@mui/material';
import {
  Announcement03,
  BarChartSquare02,
  Briefcase01,
  Building02,
  Clapperboard,
  Columns03,
  CodeBrowser,
  CreditCard02,
  FlipBackward,
  HomeSmile,
  LayoutAlt02,
  Lock01,
  Package,
  Palette,
  Sale01,
  Scales02,
  Server04,
  ShoppingBag03,
  ShoppingCart01,
  Tag03,
  Tool01,
  NotificationBox,
  Ticket01,
  Truck01,
  Users03,
  XSquare,
  ZapFast,
  Globe04,
} from '@untitled-ui/icons-react';
import { paths } from '../../paths';

export const useSections = () => {
  return [
    {
      items: [
        {
          title: 'Inicio',
          path: paths.index,
          icon: (
            <SvgIcon fontSize="small">
              <HomeSmile />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Ventas',
      items: [
        {
          title: 'Pedidos',
          icon: (
            <SvgIcon fontSize="small">
              <Package />
            </SvgIcon>
          ),
          path: paths.orders.index,
        },
        {
          title: 'Envíos',
          path: paths.shipments.index,
          icon: (
            <SvgIcon fontSize="small">
              <Truck01 />
            </SvgIcon>
          ),
        },
        {
          title: 'Carritos abandonados',
          path: paths.carts.index,
          icon: (
            <SvgIcon fontSize="small">
              <XSquare />
            </SvgIcon>
          ),
        },
        {
          title: 'Devoluciones',
          path: paths.returns.index,
          icon: (
            <SvgIcon fontSize="small">
              <FlipBackward />
            </SvgIcon>
          ),
        },
        {
          title: 'Tax free',
          path: paths.taxFree.index,
          icon: (
            <SvgIcon fontSize="small">
              <Ticket01 />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Catálogo',
      items: [
        {
          title: 'Productos',
          path: paths.products.index,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingBag03 />
            </SvgIcon>
          ),
        },
        {
          title: 'Categorías',
          path: paths.categories.index,
          icon: (
            <SvgIcon fontSize="small">
              <LayoutAlt02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Características',
          path: paths.features.index,
          icon: (
            <SvgIcon fontSize="small">
              <ZapFast />
            </SvgIcon>
          ),
        },
        {
          title: 'Colores',
          path: paths.colors.index,
          icon: (
            <SvgIcon fontSize="small">
              <Palette />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Clientes',
      items: [
        {
          title: 'Clientes',
          path: paths.customers.index,
          icon: (
            <SvgIcon fontSize="small">
              <Users03 />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Marketing',
      items: [
        {
          title: 'Descuentos',
          icon: (
            <SvgIcon fontSize="small">
              <Sale01 />
            </SvgIcon>
          ),
          items: [
            {
              title: 'Descuentos del catálogo',
              path: paths.discounts.index,
            },
            {
              title: 'Promociones del carrito',
              path: paths.promotions.index,
            },
          ],
        },
        {
          title: 'Uso de promociones',
          path: paths.promotions.usage,
          icon: (
            <SvgIcon fontSize="small">
              <Tag03 />
            </SvgIcon>
          ),
        },
        {
          title: 'Mailchimp',
          path: paths.mailchimp.index,
          icon: (
            <SvgIcon fontSize="small">
              <Tool01 />
            </SvgIcon>
          ),
        },
        {
          title: 'Tarjetas regalo',
          icon: (
            <SvgIcon fontSize="small">
              <CreditCard02 />
            </SvgIcon>
          ),
        },
      ],
    },

    {
      subheader: 'Tiendas',
      items: [
        {
          title: 'Tiendas online',
          path: paths.stores.index,
          icon: (
            <SvgIcon fontSize="small">
              <ShoppingCart01 />
            </SvgIcon>
          ),
        },
        {
          title: 'Tiendas físicas',
          path: paths.pickupStores.index,
          icon: (
            <SvgIcon fontSize="small">
              <Building02 />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Reportes',
      items: [
        {
          title: 'Reporte de ventas',
          path: paths.reports.sales,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Reporte por producto',
          path: paths.reports.productSales,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Reporte de usuarios',
          path: paths.reports.customers,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Reporte de bestsellers',
          path: paths.reports.bestsellers,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Reporte de devoluciones',
          path: paths.reports.refunds,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
        {
          title: 'Reporte de contabilidad',
          path: paths.reports.accounting,
          icon: (
            <SvgIcon fontSize="small">
              <BarChartSquare02 />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Gestor de Contenido',
      items: [
        {
          title: 'Anuncios de la tienda',
          icon: (
            <SvgIcon fontSize="small">
              <Announcement03 />
            </SvgIcon>
          ),
          path: paths.announcements.index,
        },
        {
          title: 'PopUps',
          icon: (
            <SvgIcon fontSize="small">
              <NotificationBox />
            </SvgIcon>
          ),
          path: paths.popups.index,
        },
        {
          title: 'Menú - Imagenes',
          icon: (
            <SvgIcon fontSize="small">
              <Columns03 />
            </SvgIcon>
          ),
          path: paths.menu.index,
        },
        {
          title: 'Centro de Ayuda',
          icon: (
            <SvgIcon fontSize="small">
              <Scales02 />
            </SvgIcon>
          ),
          path: paths.help.index,
        },
        {
          title: 'Página de inicio',
          icon: (
            <SvgIcon fontSize="small">
              <Clapperboard />
            </SvgIcon>
          ),
          items: [
            {
              title: 'Home',
              path: paths.homeWeb.index,
            },
            {
              title: 'Home Item',
              path: paths.layoutHomeWeb.index,
            },
            {
              title: 'Línea',
              path: paths.adminContent.home.midbanner,
            },
            {
              title: 'Sliders',
              path: paths.adminContent.home.sliders,
            },
            {
              subheader: 'Banners',
              title: 'Banners',
              items: [
                {
                  title: 'Texto',
                  path: paths.adminContent.home.bannerText,
                },
                {
                  title: 'Imagenes',
                  path: paths.adminContent.home.bannerImages,
                },
              ],
            },
            {
              title: 'Botones',
              path: paths.adminContent.home.buttons,
            },
            {
              title: 'Categorías',
              path: paths.adminContent.home.categories,
            },
            {
              title: 'Blog',
              path: paths.adminContent.home.blogs,
            },
            {
              title: 'Instagram',
              path: paths.adminContent.home.instagram,
            },
          ],
        },
        {
          title: 'Landing Page',
          icon: (
            <SvgIcon fontSize="small">
              <CodeBrowser />
            </SvgIcon>
          ),
          path: paths.landingPage.index,
        },
        {
          title: 'Categorías (Imágenes)',
          path: paths.categories_images.index,
          icon: (
            <SvgIcon fontSize="small">
              <LayoutAlt02 />
            </SvgIcon>
          ),
        },
      ],
    },
    {
      subheader: 'Recursos Humanos',
      path: paths.rrhh.index,
      items: [
        {
          title: 'Ofertas de empleo',
          icon: (
            <SvgIcon fontSize="small">
              <Briefcase01 />
            </SvgIcon>
          ),
          path: paths.rrhh.index,
        },
      ],
    },
    {
      subheader: 'Sistema',
      items: [
        {
          title: 'Procesos',
          icon: (
            <SvgIcon fontSize="small">
              <Server04 />
            </SvgIcon>
          ),
          path: paths.system.processes.index,
        },
        {
          title: 'Gestión de cuentas',
          path: paths.accounts.index,
          icon: (
            <SvgIcon fontSize="small">
              <Lock01 />
            </SvgIcon>
          ),
          items: [
            {
              title: 'Listado de cuentas',
              path: paths.accounts.list.index,
            },
            {
              title: 'Roles y permisos',
              path: paths.accounts.roles.index,
            },
          ],
        },
        {
          title: 'Países',
          path: paths.countries.index,
          icon: (
            <SvgIcon fontSize="small">
              <Globe04 />
            </SvgIcon>
          ),
        },
      ],
    },
  ];
};

export const paths = {
  401: '/401',
  404: '/404',
  500: '/500',
  index: '/',
  accounts: {
    index: '/accounts',
    list: {
      index: '/accounts/list',
    },
    roles: {
      index: '/accounts/roles',
      create: '/accounts/roles/create',
    },
  },
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
  },
  authDemo: {
    forgotPassword: {
      classic: '/auth-demo/forgot-password/classic',
      modern: '/auth-demo/forgot-password/modern',
    },
    login: {
      classic: '/auth-demo/login/classic',
      modern: '/auth-demo/login/modern',
    },
    register: {
      classic: '/auth-demo/register/classic',
      modern: '/auth-demo/register/modern',
    },
    resetPassword: {
      classic: '/auth-demo/reset-password/classic',
      modern: '/auth-demo/reset-password/modern',
    },
    verifyCode: {
      classic: '/auth-demo/verify-code/classic',
      modern: '/auth-demo/verify-code/modern',
    },
  },
  academy: {
    index: '/academy',
    courseDetails: '/academy/courses/:courseId',
  },
  account: '/account',
  analytics: '/analytics',
  blank: '/blank',
  blog: {
    index: '/blog',
    postDetails: '/blog/:postId',
    postCreate: '/blog/create',
  },
  carts: {
    index: '/carts',
  },
  checkout: '/checkout',
  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats',
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists',
    },
    forms: '/components/forms',
    modals: '/components/modals',
    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs',
  },
  contact: '/contact',
  categories: {
    index: '/categories',
    create: '/categories/create',
  },
  features: {
    index: '/features',
    create: '/features/create',
  },
  colors: {
    index: '/colors',
    create: '/colors/create',
  },
  calendar: '/calendar',
  chat: '/chat',
  crypto: '/crypto',
  customers: {
    index: '/customers',
    details: '/customers/:customerId',
    edit: '/customers/:customerId/edit',
  },
  discounts: {
    index: '/discounts',
    create: '/discounts/create',
  },
  mailchimp: {
    index: '/mailchimp',
    create: '/mailchimp/create',
  },
  docs: {
    analytics: {
      configuration: '/docs/analytics-configuration',
      eventTracking: '/docs/analytics-event-tracking',
      introduction: '/docs/analytics-introduction',
    },
    auth: {
      amplify: '/docs/auth-amplify',
      auth0: '/docs/auth-auth0',
      firebase: '/docs/auth-firebase',
      jwt: '/docs/auth-jwt',
    },
    changelog: '/docs/changelog',
    contact: '/docs/contact',
    dependencies: '/docs/dependencies',
    deployment: '/docs/deployment',
    environmentVariables: '/docs/environment-variables',
    gettingStarted: '/docs/getting-started',
    guards: {
      auth: '/docs/guards-auth',
      guest: '/docs/guards-guest',
      roleBased: '/docs/guards-role-based',
    },
    furtherSupport: '/docs/further-support',
    internationalization: '/docs/internationalization',
    mapbox: '/docs/mapbox',
    redux: '/docs/redux',
    routing: '/docs/routing',
    rtl: '/docs/rtl',
    serverCalls: '/docs/server-calls',
    settings: '/docs/settings',
    theming: '/docs/theming',
    welcome: '/docs/welcome',
  },
  ecommerce: '/ecommerce',
  fileManager: '/file-manager',
  invoices: {
    index: '/invoices',
    details: '/invoices/:orderId',
  },
  jobs: {
    index: '/jobs',
    create: '/jobs/create',
    companies: {
      details: '/jobs/companies/:companyId',
    },
  },
  kanban: '/kanban',
  logistics: {
    index: '/logistics',
    fleet: '/logistics/fleet',
  },
  mail: '/mail',
  orders: {
    index: '/orders',
    details: '/orders/:orderId',
  },
  announcements: {
    index: '/announcements',
    details: '/announcements/:id',
  },
  menu: {
    index: '/menu',
    create: '/menu/create',
  },
  popups: {
    index: '/popups',
    create: '/popups/create',
  },
  help: {
    index: '/help',
    create: '/help/create',
  },
  homeWeb: {
    index: '/home-web',
    details: '/home-web/:id',
  },
  layoutHomeWeb: {
    index: '/layout-home-web',
    details: '/layout-home-web/:id',
  },

  landingPage: {
    index: '/landing-page',
    details: '/landing-page/:id',
  },
  stores: {
    index: '/stores',
    create: '/stores/create',
  },
  pickupStores: {
    index: '/pickup-stores',
  },
  pricing: '/pricing',
  products: {
    index: '/products',
    create: '/products/create',
  },
  promotions: {
    index: '/promotions',
    create: '/promotions/create',
    usage: '/promotions/usage',
  },
  reports: {
    accounting: '/reports/accounting',
    sales: '/reports/sales',
    productSales: '/reports/productSales',
    customers: '/reports/customers',
    bestsellers: '/reports/bestsellers',
    refunds: '/reports/refunds',
  },
  returns: {
    index: '/returns',
  },
  shipments: {
    index: '/shipments',
  },
  social: {
    index: '/social',
    profile: '/social/profile',
    feed: '/social/feed',
  },
  taxFree: {
    index: '/tax-free',
  },
  adminContent: {
    index: '/admin-content',
    notices: {
      index: '/announcements',
    },
    home: {
      index: '/admin-content/home',
      midbanner: '/admin-content/home/midbanner',
      layout: '/admin-content/home/layout',
      sliders: '/admin-content/home/sliders',
      bannerText: '/admin-content/home/banner-text',
      bannerImages: '/admin-content/home/banner-images',
      categories: '/admin-content/home/categories',
      buttons: '/admin-content/home/buttons',
      blogs: '/admin-content/home/blogs',
      instagram: '/admin-content/home/instagram',
    },
  },
  categories_images: {
    index: '/categories-images',
    create: '/categories-images/create',
  },
  rrhh: {
    index: '/rrhh',
    jobOfferId: {
      index: '/rrhh/:jobOfferId',
      candidates: '/rrhh/:jobOfferId/:jobDemandId',
    },
  },
  system: {
    index: '/system',
    processes: {
      index: '/system/processes',
    },
  },
  countries: {
    index: '/countries',
  },
};

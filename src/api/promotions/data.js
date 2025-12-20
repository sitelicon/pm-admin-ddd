import { subDays, subHours } from 'date-fns';

const now = new Date();

export const stores = [
  {
    id: 1,
    code: 'es',
    name: 'España',
  },
  {
    id: 3,
    code: 'fr',
    name: 'Francia',
  },
  {
    id: 4,
    code: 'pt',
    name: 'Portugal',
  },
  {
    id: 5,
    code: 'it',
    name: 'Italia',
  },
  {
    id: 6,
    code: 'mad',
    name: 'Madeira',
  },
];

export const customerGroups = [
  {
    id: 1,
    code: 'general',
    name: 'Fidelizado',
  },
  {
    id: 2,
    code: 'employee',
    name: 'Empleado',
  },
  {
    id: 3,
    code: 'unknown',
    name: 'Invitado',
  },
];

export const applyTypes = [
  {
    id: 3,
    code: 'percent_of_product_price_discount',
    label: 'Porcentaje de descuento sobre el precio del producto',
  },
  {
    id: 4,
    code: 'fixed_amount_discount',
    label: 'Cantidad fija',
  },
  {
    id: 5,
    code: 'fixed_amount_discount_for_whole_cart',
    label: 'Cantidad fija para todo el carrito',
  },
  {
    id: 6,
    code: 'percent_of_price_discount_for_whole_cart',
    label:
      'Procentaje sobre el precio dinal para todo el carrito (incluyendo impuestos)',
  },
];

export const promotions = [
  {
    id: 1,
    name: 'Envio gratuito',
    description: 'Gratuito para importes mayores de 25€',
    active: true,
    stores: [stores[0]],
    customerGroups: [
      customerGroups[0],
      customerGroups[1],
      customerGroups[2],
      customerGroups[3],
    ],
    from: subDays(now, 6).getTime(),
    to: subDays(now, 1).getTime(),
    globalUsageLimit: 0,
    currentUses: 12032,
    usesPerCupon: 0,
    usesPerCustomer: 0,
    maxItems: 0,
    step: 1,
    cuponCode: undefined,
    apply: {
      id: 'apply_as_percentage_of_original',
      label: 'Porcentaje del precio original',
      value: 0,
    },
    freeShipping: true,
    excludeOnSaleItems: true,
    createdAt: subDays(now, 10).getTime(),
    updatedAt: subHours(now, 6).getTime(),
  },
  {
    id: 2,
    name: '10INSTAGRAM',
    description: 'Descuento 10% para RRSS',
    active: true,
    stores: [stores[0], stores[1]],
    customerGroups: [
      customerGroups[0],
      customerGroups[1],
      customerGroups[2],
      customerGroups[3],
    ],
    from: subDays(now, 660).getTime(),
    to: undefined,
    globalUsageLimit: 20,
    currentUses: 3,
    usesPerCupon: 5,
    usesPerCustomer: 0,
    maxItems: 0,
    step: 1,
    cuponCode: '10INOCT',
    apply: {
      id: 'apply_as_percentage_of_original',
      label: 'Porcentaje del precio original',
      value: 10,
    },
    freeShipping: false,
    excludeOnSaleItems: true,
    createdAt: subDays(now, 661).getTime(),
    updatedAt: subHours(now, 330).getTime(),
  },
];

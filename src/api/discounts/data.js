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
    id: 1,
    code: 'apply_as_percentage_of_original',
    label: 'Porcentaje del precio original',
  },
  {
    id: 2,
    code: 'apply_as_fixed_amount',
    label: 'Cantidad fija',
  },
  {
    id: 3,
    code: 'adjust_final_price_to_this_percentage',
    label: 'Ajustar precio final a este porcentaje',
  },
  {
    id: 4,
    code: 'adjust_final_price_to_discount_value',
    label: 'Ajustar precio final al valor del descuento',
  },
];

export const discounts = [
  {
    id: 1,
    name: '20% Fidelizados BF',
    description: 'Se adelanta para fidelizados toda la web al 20%',
    active: true,
    stores: [stores[0], stores[1]],
    customerGroups: [customerGroups[1]],
    from: subDays(now, 6).getTime(),
    to: subDays(now, 1).getTime(),
    apply: {
      id: 'apply_as_percentage_of_original',
      label: 'Porcentaje del precio original',
      value: 20,
    },
    excludeOnSaleProducts: true,
    createdAt: subDays(now, 10).getTime(),
    updatedAt: subHours(now, 6).getTime(),
  },
  {
    id: 2,
    name: '30% EMPLEADOS',
    description:
      'Empleados tiene un 30% de descuento sobre productos que no tengan rebajas.',
    active: true,
    stores: [stores[0], stores[1]],
    customerGroups: [customerGroups[4]],
    from: subDays(now, 660).getTime(),
    to: undefined,
    apply: {
      id: 'apply_as_percentage_of_original',
      label: 'Porcentaje del precio original',
      value: 30,
    },
    excludeOnSaleProducts: false,
    createdAt: subDays(now, 661).getTime(),
    updatedAt: subHours(now, 330).getTime(),
  },
];

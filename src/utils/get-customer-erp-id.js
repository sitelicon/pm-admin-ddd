export const getCustomerErpId = (customer, storeId) => {
  if (customer.customer_erp_id) {
    return customer.customer_erp_id;
  }

  if (customer.group_id === 3) {
    switch (storeId) {
      case 1:
        return '99999999';
      case 4:
        return '99999998';
      default:
        break;
    }
  }

  return 'Desconocido';
};

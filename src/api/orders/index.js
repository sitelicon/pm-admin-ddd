import { apiRequest } from '../../utils/api-request';

class OrdersApi {
  async getOrders(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir, all } = request;

    const response = await apiRequest('admin/orders', {
      method: 'GET',
      version: 'v2',
      params: {
        search: filters?.search,
        number: filters?.number,
        statusId: Array.isArray(filters?.statusId)
          ? filters.statusId.join(',')
          : filters?.statusId,
        storeId: filters?.storeId,
        erpId: filters?.erpId,
        customerId: filters?.customerId,
        groupId: filters?.groupId,
        paymentMethodId: filters?.paymentMethodId,
        email: filters?.email,
        pickupStoreId: filters?.pickupStoreId,
        createdFrom: filters?.createdFrom,
        createdTo: filters?.createdTo,
        hourFrom: filters?.hourFrom,
        hourTo: filters?.hourTo,
        name: filters?.name,
        shipmentType: filters?.shipmentType,
        page: Math.max(1, page + 1),
        perPage,
        sortBy,
        sortDir,
        all,
      },
    });

    return response;
  }

  async getExportOrdersReport(request = {}) {
    const { filters, sortBy, sortDir } = request;
    const nombreColumnas = filters?.columnsNames
      ? filters.columnsNames.join(',')
      : null;

    const response = await apiRequest('admin/orders/export/weekly', {
      method: 'GET',
      params: {
        search: filters?.search,
        number: filters?.number,
        statusId: Array.isArray(filters?.statusId)
          ? filters.statusId.join(',')
          : filters?.statusId,
        storeId: filters?.storeId,
        erpId: filters?.erpId,
        email: filters?.email,
        createdFrom: filters?.createdFrom,
        createdTo: filters?.createdTo,
        name: filters?.name,
        shipmentType: filters?.shipmentType,
        sortBy,
        sortDir,
        columnsNames: nombreColumnas,
      },
    });

    return response;
  }

  async getExportOrders(request = {}) {
    const { filters, sortBy, sortDir } = request;

    const response = await apiRequest('admin/orders/export', {
      method: 'GET',
      params: {
        search: filters?.search,
        number: filters?.number,
        statusId: Array.isArray(filters?.statusId)
          ? filters.statusId.join(',')
          : filters?.statusId,
        storeId: filters?.storeId,
        erpId: filters?.erpId,
        email: filters?.email,
        createdFrom: filters?.createdFrom,
        createdTo: filters?.createdTo,
        name: filters?.name,
        shipmentType: filters?.shipmentType,
        sortBy,
        sortDir,
      },
    });

    return response;
  }

  async getOrder(id) {
    const response = await apiRequest(`admin/orders/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async updateOrderStatus(orderId, statusId) {
    const response = await apiRequest(`admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status_id: statusId,
      }),
    });

    return response;
  }

  async updateOrderShippingProvider(orderId, shippingProviderId) {
    const response = await apiRequest(
      `admin/orders/${orderId}/shipping-provider`,
      {
        method: 'PUT',
        body: JSON.stringify({
          shipping_provider_id: shippingProviderId,
        }),
      },
    );

    return response;
  }

  async getOrderInvoice(orderId) {
    const response = await apiRequest(`admin/orders/${orderId}/invoice`, {
      method: 'GET',
    });

    return response;
  }

  async syncOrder(orderId) {
    const response = await apiRequest(`admin/orders/${orderId}/synchronize`, {
      method: 'POST',
    });

    return response;
  }

  async getTaxFreeRequests(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/orders/tax-free-requests', {
      method: 'GET',
      params: {
        orderId: filters?.orderId,
        status: filters?.status,
        shopId: filters?.shopId,
        page: Math.max(1, page + 1),
        perPage,
        sortBy,
        sortDir,
      },
    });

    return response;
  }

  async updateTaxFreeRequestStatus(requestId, status) {
    const response = await apiRequest(
      `admin/orders/tax-free-requests/${requestId}/status`,
      {
        method: 'POST',
        body: JSON.stringify({
          status,
        }),
      },
    );

    return response;
  }

  async sendConfirmationEmail(orderId) {
    const response = await apiRequest(
      `admin/orders/emails/${orderId}/confirmation`,
      { method: 'POST' },
    );

    return response;
  }

  async sendShippedEmail(orderId) {
    const response = await apiRequest(
      `admin/orders/emails/${orderId}/shipped`,
      { method: 'POST' },
    );

    return response;
  }

  async sendPickupShippedEmail(orderId) {
    const response = await apiRequest(
      `admin/orders/emails/${orderId}/pickup-shipped`,
      { method: 'POST' },
    );

    return response;
  }

  async sendPickupDeliveredEmail(orderId) {
    const response = await apiRequest(
      `admin/orders/emails/${orderId}/pickup-delivered`,
      { method: 'POST' },
    );

    return response;
  }

  async updateBillingAddress(orderId, request = {}) {
    const response = await apiRequest(
      `admin/orders/${orderId}/billing-address`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      },
    );

    return response;
  }

  async updateShippingAddress(orderId, request = {}) {
    const response = await apiRequest(
      `admin/orders/${orderId}/shipping-address`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      },
    );

    return response;
  }

  async updateCustomerInfo(orderId, request = {}) {
    const response = await apiRequest(`admin/orders/${orderId}/customer-info`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return response;
  }

  async getOrderWithInvoices(customerId) {
    return apiRequest(`admin/orders/customers/${customerId}/invoices`);
  }

  async updateOrderShippingProviderNumber(orderId, shippingProviderNumber) {
    const response = await apiRequest(
      `admin/orders/${orderId}/shipping-provider-number`,
      {
        method: 'PUT',
        body: JSON.stringify({
          shipping_provider_number: shippingProviderNumber,
        }),
      },
    );

    return response;
  }

  async updateOrderCustomerEmail(orderId, email) {
    const response = await apiRequest(
      `admin/orders/${orderId}/customer-email`,
      {
        method: 'PUT',
        body: JSON.stringify({
          email,
        }),
      },
    );

    return response;
  }

  async uploadOrdersToICG(data) {
    const response = await apiRequest(`admin/orders/upload_icg`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response;
  }
}

export const ordersApi = new OrdersApi();

import { apiRequest } from '../../utils/api-request';

class ShipmentsApi {
  async getShipments(request = {}) {
    const { filters, page, perPage } = request;

    const response = await apiRequest('admin/shipments', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
        sortField: 'created_at',
        sortOrder: 'desc',
      },
    });

    return response;
  }

  async getShipment(shipmentId) {
    const response = await apiRequest(`admin/shipments/${shipmentId}`);

    return response;
  }

  async updateShipment(shipmentId, request = {}) {
    const { status, reason } = request;

    const response = await apiRequest(`admin/shipments/${shipmentId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        reason,
      }),
    });

    return response;
  }
}

export const shipmentsApi = new ShipmentsApi();

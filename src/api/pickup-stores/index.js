import { apiRequest } from '../../utils/api-request';

class PickupStoresApi {
  async getStores(request = {}) {
    const { filters, page, perPage, sortBy, sortDir } = request;

    const result = await apiRequest('admin/pickups/stores', {
      method: 'GET',
      params: {
        id: filters?.id,
        ids: filters?.ids,
        search: filters?.search,
        name: filters?.name,
        email: filters?.email,
        groupId: filters?.groupId,
        storeId: filters?.storeId,
        phone: filters?.phone,
        isGuest: 0,
        page: Math.max(1, page + 1),
        perPage,
        sortBy,
        sortDir,
      },
    });

    return result;
  }

  async getStoreById(id) {
    const result = await apiRequest(`admin/pickups/stores/${id}`);

    return result;
  }

  async updateShipping(storeId, isEnabled = true) {
    const result = await apiRequest(
      `admin/pickups/stores/${storeId}/shipping`,
      {
        method: 'PUT',
        body: JSON.stringify({
          shipping_enabled: isEnabled,
        }),
      },
    );

    return result;
  }

  async updateErpId(storeId, erpId) {
    const result = await apiRequest(`admin/pickups/stores/${storeId}/erpid`, {
      method: 'PUT',
      body: JSON.stringify({
        erp_id: erpId,
      }),
    });

    return result;
  }

  async updateStore(storeId, request = {}) {
    const result = await apiRequest(`admin/pickups/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return result;
  }

  async createStore(request = {}) {
    const result = await apiRequest('admin/pickups/stores', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return result;
  }

  async deleteStore(storeId) {
    const result = await apiRequest(`admin/pickups/stores/${storeId}`, {
      method: 'DELETE',
    });

    return result;
  }
}

export const pickupStoresApi = new PickupStoresApi();

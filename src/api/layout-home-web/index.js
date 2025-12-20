import { apiRequest } from '../../utils/api-request';

class LayoutHomeWebApi {
  async getLayoutHomeWebs(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir, storeId } = request;

    const response = await apiRequest('admin/home_layout', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
        status: filters.status,
        order: sortDir,
        orderBy: sortBy,
        storeId,
      },
    });

    return response;
  }

  async getLayoutById(id, selectedStore) {
    const response = await apiRequest(`admin/home_layout/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        storeId: parseInt(selectedStore),
      }),
    });

    return response;
  }

  async getLayoutHomeWeb(id) {
    const response = await apiRequest(`admin/home_layout_item/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createLayoutHomeWeb(payload) {
    const response = await apiRequest(`admin/home_layout`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateLayoutHomeWeb(id, payload) {
    const response = await apiRequest(`admin/home_layout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteLayoutHomeWeb(id) {
    const response = await apiRequest(`admin/home_layout/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const layoutHomeWebApi = new LayoutHomeWebApi();

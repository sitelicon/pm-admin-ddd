import { apiRequest } from '../../utils/api-request';

class InstagramLayoutItemApi {
  async getInstagramLayoutItems(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/instagram_layout_items', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        instagramId: request.instagramId,
      },
    });

    return response;
  }

  async getInstagramLayoutItem(id) {
    const response = await apiRequest(`admin/instagram_layout_items/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createInstagramLayoutItem(payload) {
    const response = await apiRequest(`admin/instagram_layout_items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateInstagramLayoutItem(id, payload) {
    const response = await apiRequest(`admin/instagram_layout_items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteInstagramLayoutItem(id) {
    const response = await apiRequest(`admin/instagram_layout_items/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async orderItems(payload) {
    const response = await apiRequest(`admin/instagram_layout_items/order`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }
}

export const instagramLayoutItemApi = new InstagramLayoutItemApi();

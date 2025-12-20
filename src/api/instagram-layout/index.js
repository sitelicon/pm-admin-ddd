import { apiRequest } from '../../utils/api-request';

class InstagramLayoutApi {
  async getInstagramLayouts(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/instagram_layout', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        status: filters?.status,
      },
    });

    return response;
  }

  async getInstagramLayout(id) {
    const response = await apiRequest(`admin/instagram_layout/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createInstagramLayout(payload) {
    const response = await apiRequest(`admin/instagram_layout`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateInstagramLayout(id, payload) {
    const response = await apiRequest(`admin/instagram_layout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteInstagramLayout(id) {
    const response = await apiRequest(`admin/instagram_layout/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const instagramLayoutApi = new InstagramLayoutApi();

import { apiRequest } from '../../utils/api-request';

class BannerImageLayoutApi {
  async getBannerImageLayouts(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/banner_images_layout', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        status: filters?.status,
      },
    });

    return response;
  }

  async getBannerImageLayout(id) {
    const response = await apiRequest(`admin/banner_images_layout/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createBannerImageLayout(payload) {
    const response = await apiRequest(`admin/banner_images_layout`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateBannerImageLayout(id, payload) {
    const response = await apiRequest(`admin/banner_images_layout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteBannerImageLayout(id) {
    const response = await apiRequest(`admin/banner_images_layout/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const bannerImageLayoutApi = new BannerImageLayoutApi();

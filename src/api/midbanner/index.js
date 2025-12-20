import { apiRequest } from '../../utils/api-request';

class MidBanner {
  async getMidBanner(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/mid_banner', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        status: filters?.status,
      },
    });

    return response;
  }

  async createMidBanner(request) {
    const response = await apiRequest('admin/mid_banner', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response;
  }

  async updateMidBanner(id, request) {
    const response = await apiRequest(`admin/mid_banner/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return response;
  }

  async getMidSeasonBanner(id) {
    const response = await apiRequest(`admin/mid_banner/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async deleteMidBanner(id) {
    const response = await apiRequest(`admin/mid_banner/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async createMidBannerLanguage(request) {
    const response = await apiRequest(`admin/mid_banner_data`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response;
  }

  async updateMidBannerLanguage(id, request) {
    const response = await apiRequest(`admin/mid_banner_data/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return response;
  }
}

export const midBannerApi = new MidBanner();

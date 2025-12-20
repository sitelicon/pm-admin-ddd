import { apiRequest } from '../../utils/api-request';

class BannerTextLayoutApi {
  async getBannerTextLayouts(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/banner_text_layout', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        status: filters?.status,
      },
    });

    return response;
  }

  async getBannerTextLayout(id) {
    const response = await apiRequest(`admin/banner_text_layout/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createBannerTextLayout(payload) {
    const response = await apiRequest(`admin/banner_text_layout`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateBannerTextLayout(id, payload) {
    const response = await apiRequest(`admin/banner_text_layout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteBannerTextLayout(id) {
    const response = await apiRequest(`admin/banner_text_layout/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async deleteSelectedBannerTextLayouts(bannerIds) {
    const response = await apiRequest(`admin/banner_text_layout`, {
      method: 'DELETE',
      body: JSON.stringify({ ids: bannerIds }),
    });

    return response;
  }

  async updateItemLanguage(id, payload) {
    const response = await apiRequest(
      `admin/banner_text_layout_languages/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    );

    return response;
  }

  async createItemLanguage(payload) {
    const response = await apiRequest(`admin/banner_text_layout_languages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }
}

export const bannerTextLayoutApi = new BannerTextLayoutApi();

import { apiRequest } from '../../utils/api-request';

class BannerTextLayoutItemApi {
  async getBannerTextLayoutItems(request = {}) {
    const { page = 0, perPage } = request;

    const response = await apiRequest('admin/banner_text_layout_items', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
        bannerTextLayoutId: request.bannerTextLayoutId,
      },
    });

    return response;
  }

  async getBannerTextLayoutItem(id) {
    const response = await apiRequest(`admin/banner_text_layout_items/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createBannerTextLayoutItem(payload) {
    const response = await apiRequest(`admin/banner_text_layout_items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateBannerTextLayoutItem(id, payload) {
    const response = await apiRequest(`admin/banner_text_layout_items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteBannerTextLayoutItem(id) {
    const response = await apiRequest(`admin/banner_text_layout_items/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async orderItems(payload) {
    const response = await apiRequest(`admin/banner_text_layout_items/order`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }
}

export const bannerTextLayoutItemApi = new BannerTextLayoutItemApi();

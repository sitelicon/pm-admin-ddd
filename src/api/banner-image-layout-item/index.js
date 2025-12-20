import { apiRequest } from '../../utils/api-request';

class BannerImageLayoutItemApi {
  async getBannerImageLayoutItems(request = {}) {
    const { page = 0, perPage } = request;

    const response = await apiRequest('admin/banner_image_layout_items', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
        bannerImageLayoutId: request.bannerImageLayoutId,
      },
    });

    return response;
  }

  async getBannerImageLayoutItem(id) {
    const response = await apiRequest(`admin/banner_image_layout_items/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createBannerImageLayoutItem(payload) {
    const response = await apiRequest(`admin/banner_image_layout_items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateBannerImageLayoutItem(id, payload) {
    const response = await apiRequest(`admin/banner_image_layout_items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteBannerImageLayoutItem(id) {
    const response = await apiRequest(`admin/banner_image_layout_items/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async orderItems(payload) {
    const response = await apiRequest(`admin/banner_image_layout_items/order`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }
}

export const bannerImageLayoutItemApi = new BannerImageLayoutItemApi();

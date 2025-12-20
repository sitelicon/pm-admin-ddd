import { apiRequest } from '../../utils/api-request';

class SliderLayoutItemApi {
  async getSliderLayoutItems(request = {}) {
    const { page = 0, perPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/slider_layout_items', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
        sliderId: request.sliderId,
      },
    });

    return response;
  }

  async getSliderLayoutItem(id) {
    const response = await apiRequest(`admin/slider_layout_items/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createSliderLayoutItem(payload) {
    const response = await apiRequest(`admin/slider_layout_items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateSliderLayoutItem(id, payload) {
    const response = await apiRequest(`admin/slider_layout_items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteSliderLayoutItem(id) {
    const response = await apiRequest(`admin/slider_layout_items/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async orderItems(payload) {
    const response = await apiRequest(`admin/slider_layout_items/order`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }
}

export const sliderLayoutItemApi = new SliderLayoutItemApi();

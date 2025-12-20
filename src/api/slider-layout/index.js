import { apiRequest } from '../../utils/api-request';

class SliderLayoutApi {
  async getSliderLayouts(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/slider_layout', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
        status: filters?.status,
      },
    });

    return response;
  }

  async getSliderLayout(id) {
    const response = await apiRequest(`admin/slider_layout/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createSliderLayout(payload) {
    const response = await apiRequest(`admin/slider_layout`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateSliderLayout(id, payload) {
    const response = await apiRequest(`admin/slider_layout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteSliderLayout(id) {
    const response = await apiRequest(`admin/slider_layout/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const sliderLayoutApi = new SliderLayoutApi();

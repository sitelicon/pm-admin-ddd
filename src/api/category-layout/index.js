import { apiRequest } from '../../utils/api-request';

class CategoryLayoutApi {
  async getCategoryLayouts(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/category_layout', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        status: filters?.status,
      },
    });

    return response;
  }

  async getCategoryLayout(id) {
    const response = await apiRequest(`admin/category_layout/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createCategoryLayout(payload) {
    const response = await apiRequest(`admin/category_layout`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateCategoryLayout(id, payload) {
    const response = await apiRequest(`admin/category_layout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteCategoryLayout(id) {
    const response = await apiRequest(`admin/category_layout/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const categoryLayoutApi = new CategoryLayoutApi();

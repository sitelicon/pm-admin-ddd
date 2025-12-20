import { apiRequest } from '../../utils/api-request';

class CategoryLayoutItemApi {
  async getCategoryLayoutItems(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/category_layout_items', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        categoryId: request.categoryId,
      },
    });

    return response;
  }

  async getCategoryLayoutItem(id) {
    const response = await apiRequest(`admin/category_layout_items/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createCategoryLayoutItem(payload) {
    const response = await apiRequest(`admin/category_layout_items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateCategoryLayoutItem(id, payload) {
    const response = await apiRequest(`admin/category_layout_items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteCategoryLayoutItem(id) {
    const response = await apiRequest(`admin/category_layout_items/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async orderItems(payload) {
    const response = await apiRequest(`admin/category_layout_items/order`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }
}

export const categoryLayoutItemApi = new CategoryLayoutItemApi();

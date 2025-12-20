import { apiRequest } from '../../utils/api-request';

class BlogLayoutItemApi {
  async getBlogLayoutItems(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/blog_layout_items', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        blogId: request.blogId,
      },
    });

    return response;
  }

  async getBlogLayoutItem(id) {
    const response = await apiRequest(`admin/blog_layout_items/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createBlogLayoutItem(payload) {
    const response = await apiRequest(`admin/blog_layout_items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateBlogLayoutItem(id, payload) {
    const response = await apiRequest(`admin/blog_layout_items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteBlogLayoutItem(id) {
    const response = await apiRequest(`admin/blog_layout_items/${id}`, {
      method: 'DELETE',
    });

    return response;
  }

  async orderItems(payload) {
    const response = await apiRequest(`admin/blog_layout_items/order`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }
}

export const blogLayoutItemApi = new BlogLayoutItemApi();

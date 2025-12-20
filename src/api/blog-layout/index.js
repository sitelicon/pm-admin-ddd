import { apiRequest } from '../../utils/api-request';

class BlogLayoutApi {
  async getBlogLayouts(request = {}) {
    const { filters, page = 0, rowsPerPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/blog_layout', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: rowsPerPage,
        status: filters?.status,
      },
    });

    return response;
  }

  async getBlogLayout(id) {
    const response = await apiRequest(`admin/blog_layout/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createBlogLayout(payload) {
    const response = await apiRequest(`admin/blog_layout`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateBlogLayout(id, payload) {
    const response = await apiRequest(`admin/blog_layout/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteBlogLayout(id) {
    const response = await apiRequest(`admin/blog_layout/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const blogLayoutApi = new BlogLayoutApi();

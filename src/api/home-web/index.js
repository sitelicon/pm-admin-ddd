import { apiRequest } from '../../utils/api-request';
import { formatDateTime } from '../../utils/date-locale';

class HomeWebApi {
  async getAllHome(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/home_web', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
        active: filters.active,
        title: filters.title,
        order: sortDir,
        orderBy: sortBy,
      },
    });

    return response;
  }

  async deleteHomeWeb(id) {
    const response = await apiRequest(`admin/home_web/${id}`, {
      method: 'DELETE',
    });
    return response;
  }

  async createHomeWeb(data) {
    const response = await apiRequest('admin/home_web', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        active: data.active,
        from_date: data.from_date ? formatDateTime(data.from_date) : null,
        to_date: data.to_date ? formatDateTime(data.to_date) : null,
      }),
    });
    return response;
  }

  async updateHomeWeb(id, data) {
    const response = await apiRequest(`admin/home_web/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: data.title,
        active: data.active,
        from_date: data.from_date ? formatDateTime(data.from_date) : null,
        to_date: data.to_date ? formatDateTime(data.to_date) : null,
        store_id: data.store_id,
      }),
    });
    return response;
  }
}

export const homeWebApi = new HomeWebApi();

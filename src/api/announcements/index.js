import { apiRequest } from '../../utils/api-request';

class AnnouncementsApi {
  async getAnnouncements(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/announcements', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage: perPage,
        status: filters.status,
      },
    });

    return response;
  }

  async getAnnouncement(id) {
    const response = await apiRequest(`admin/announcements/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createAnnouncement(payload) {
    const response = await apiRequest(`admin/announcements`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateAnnouncement(id, payload) {
    const response = await apiRequest(`admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async deleteAnnouncement(id) {
    const response = await apiRequest(`admin/announcements/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const announcementsApi = new AnnouncementsApi();

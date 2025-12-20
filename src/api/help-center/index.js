import axios from 'axios';
import { apiRequest } from '../../utils/api-request';

class HelpCenterApi {
  // GENERAL
  async getHelpCenter(lang, store) {
    const response = await apiRequest(
      `admin/help-center/store/${store}/lang/${lang}`,
      {
        method: 'GET',
        version: 'v2',
      },
    );

    return response;
  }

  async createHelpCenter(data) {
    const response = await apiRequest(`admin/help-center`, {
      method: 'POST',
      version: 'v2',
      body: JSON.stringify(data),
    });

    return response;
  }

  async updateHelpCenter(id, data) {
    const response = await apiRequest(`admin/help-center/${id}`, {
      method: 'PUT',
      version: 'v2',
      body: JSON.stringify(data),
    });
    return response;
  }

  async deleteHelpCenter(id) {
    const response = await apiRequest(`admin/help-center/${id}`, {
      version: 'v2',
      method: 'DELETE',
    });

    return response;
  }

  async uploadIconHelpCenter(id, data) {
    const formData = new FormData();
    formData.append('icon', data.icon);

    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/admin/help-center/icon/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response;
  }

  async updateIconHelpCenter(id, data) {
    const formData = new FormData();
    formData.append('icon', data.icon);

    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/admin/help-center/update-icon/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response;
  }

  // ITEMS
  async createHelpCenterItem(data) {
    const response = await apiRequest(`admin/help-center-items`, {
      method: 'POST',
      version: 'v2',
      body: JSON.stringify(data),
    });

    return response;
  }

  async deleteHelpCenterItem(id) {
    const response = await apiRequest(`admin/help-center-items/${id}`, {
      method: 'DELETE',
      version: 'v2',
    });

    return response;
  }

  async getHelpCenterId(id) {
    const response = await apiRequest(`admin/help-center/${id}`, {
      version: 'v2',
      method: 'GET',
    });

    return response;
  }

  async updateHelpCenterItem(id, data) {
    const response = await apiRequest(`admin/help-center-items/${id}`, {
      method: 'PUT',
      version: 'v2',
      body: JSON.stringify(data),
    });
    return response;
  }
}

export const helpCenterApi = new HelpCenterApi();

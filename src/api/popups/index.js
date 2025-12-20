import { apiRequest } from '../../utils/api-request';
import axios from 'axios';

class Popups {
  async getPopUps(lang) {
    const res = apiRequest(`admin/pop-up/lang/${lang}`, {
      method: 'GET',
    });
    return res;
  }

  async getPopUp(id) {
    const res = apiRequest(`admin/pop-up/${id}`, {
      method: 'GET',
    });
    return res;
  }

  async createPopUp(data) {
    const res = apiRequest(`admin/pop-up`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
  }

  async uploadImage(id, data) {
    const formData = new FormData();
    if (data.source_desktop) {
      formData.append('source_desktop', data.source_desktop);
    }
    if (data.source_mobile) {
      formData.append('source_mobile', data.source_mobile);
    }
    const token = localStorage.getItem('accessToken');
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/pop-up/image/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return res;
  }

  async updateImage(id, data) {
    const formData = new FormData();
    if (data.source_desktop) {
      formData.append('source_desktop', data.source_desktop);
    }
    if (data.source_mobile) {
      formData.append('source_mobile', data.source_mobile);
    }
    const token = localStorage.getItem('accessToken');
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/pop-up/update-image/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return res;
  }

  async updatePopUp(id, data) {
    const res = apiRequest(`admin/pop-up/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res;
  }

  async deletePopUp(id) {
    const res = apiRequest(`admin/pop-up/${id}`, {
      method: 'DELETE',
    });
    return res;
  }
}

export const popupsApi = new Popups();

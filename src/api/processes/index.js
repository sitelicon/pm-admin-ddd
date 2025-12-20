import axios from 'axios';
import { apiRequest } from '../../utils/api-request';

class ProcessesApi {
  async getProcesses(request = {}) {
    //TODO: Add paginations & filters option in the future (api side)
    const { filters, page = 0, perPage, sortBy, sortDir } = request;

    const response = await apiRequest('admin/processes', {
      method: 'GET',
      // params: {
      //   page: Math.max(1, page + 1),
      //   perPage,
      //   status: filters.status,
      // },
    });

    return response;
  }

  async executeProcess(id) {
    return await apiRequest(`admin/processes/${id}/execute`, {
      method: 'POST',
    });
  }

  async uploadFileToS3(path, data) {
    const formData = new FormData();
    formData.append('file', data);
    formData.append('path', path);

    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/admin/files/uploadFileToS3`,
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

  async updateStatus() {
    return await apiRequest('admin/files/actualiceOrdersStatusShipping', {
      method: 'GET',
      version: 'v2',
    });
  }

  async updateStock() {
    return await apiRequest('admin/files/actualiceStockProduct', {
      method: 'GET',
      version: 'v2',
    });
  }
}

export const processesApi = new ProcessesApi();

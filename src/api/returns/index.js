import axios from 'axios';
import { apiRequest } from '../../utils/api-request';

class ReturnsApi {
  async getReturns(request = {}) {
    const { filters, page, perPage, ...other } = request;

    const response = await apiRequest('admin/returns', {
      method: 'GET',
      params: {
        ...other,
        customerId: filters?.customerId,
        page: page ? Math.max(1, page + 1) : 1,
        perPage,
      },
    });

    return response;
  }

  async getReturn(returnId) {
    const response = await apiRequest(`admin/returns/${returnId}`);

    return response;
  }

  async updateReturn(returnId, request = {}) {
    const { status, reason } = request;

    const response = await apiRequest(`admin/returns/${returnId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        reason,
      }),
    });

    return response;
  }

  async postMessage(refundNumber, request = {}) {
    const formData = new FormData();
    formData.append('message', request.body);
    formData.append('author', request.author);
    if (request.file) {
      formData.append('file', request.file, request.file.name);
    }
    formData.append('visible', request.visible);
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/returns/message/${refundNumber}`,
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

  async approveReturn(returnId) {
    const response = await apiRequest(`admin/returns/approve/${returnId}`, {
      method: 'POST',
    });

    return response;
  }

  async updateReturn(returnId, request) {
    const response = await apiRequest(`admin/returns/${returnId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return response;
  }

  async updateStatusReturn(returnId, request) {
    const response = await apiRequest(`admin/returns/${returnId}/status`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return response;
  }
}

export const returnsApi = new ReturnsApi();

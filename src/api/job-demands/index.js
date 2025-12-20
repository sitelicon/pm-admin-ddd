import { apiRequest } from '../../utils/api-request';

class JobDemandsApi {
  async getJobOffer(id) {
    const response = await apiRequest(`admin/job-demands/job-offer/${id}`, {
      useToken: true,
      method: 'GET',
    });

    return response;
  }

  async getDemand(id) {
    const response = await apiRequest(`admin/job-demands/${id}`, {
      useToken: true,
      method: 'GET',
    });

    return response;
  }

  async updateDemand(id, request) {
    const response = await apiRequest(`admin/job-demands/${id}`, {
      useToken: true,
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return response;
  }

  async deleteDemand(id) {
    const response = await apiRequest(`admin/job-demands/${id}`, {
      useToken: true,
      method: 'DELETE',
    });

    return response;
  }

  async postDemand(id, request) {
    const response = await apiRequest(`admin/job-demands/${id}`, {
      useToken: true,
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response;
  }

  async sendFinalistEmail(id) {
    const response = await apiRequest(`admin/job-demands/${id}/finalist`, {
      useToken: true,
      method: 'GET',
    });

    return response;
  }
}

export const jobDemandsAPI = new JobDemandsApi();

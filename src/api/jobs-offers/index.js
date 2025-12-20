import { apiRequest } from '../../utils/api-request';

class JobsOfferAPI {
  async getJobOffers(search) {
    const jobOffers = await apiRequest('admin/job-offers', {
      useToken: true,
      method: 'GET',
      params: {
        search: search?.search,
        page: search?.page,
        perPage: search?.perPage,
        sortBy: search?.sortBy,
        sortDir: search?.sortDir,
        store: search?.filters?.store,
        visibility:
          search?.filters?.visibility === 'true'
            ? 1
            : search?.filters?.visibility === 'false'
            ? 0
            : undefined,
      },
    });
    return jobOffers;
  }

  async getJobOffer(id) {
    const jobOffer = await apiRequest(`admin/job-offers/${id}`, {
      useToken: true,
      method: 'GET',
    });
    return jobOffer;
  }

  async createJobOffer(params) {
    const createOffer = await apiRequest('admin/job-offers', {
      useToken: true,
      method: 'POST',
      body: JSON.stringify(params),
    });
    return createOffer;
  }

  async updateJobOffer(id, params) {
    const updateOffer = await apiRequest(`admin/job-offers/${id}`, {
      useToken: true,
      method: 'PUT',
      body: JSON.stringify(params),
    });
    return updateOffer;
  }

  async deleteJobOffer(id) {
    const deleteOffer = await apiRequest(`admin/job-offers/${id}`, {
      useToken: true,
      method: 'DELETE',
    });
    return deleteOffer;
  }

  async cloneJobOffer(id) {
    const cloneOffer = await apiRequest(`admin/job-offers/clone/${id}`, {
      useToken: true,
      method: 'POST',
    });
    return cloneOffer;
  }

  async postSendEmails(id, params) {
    const sendEmails = await apiRequest(`admin/job-offers/send/${id}`, {
      useToken: true,
      method: 'POST',
      body: JSON.stringify(params),
    });
    return sendEmails;
  }
}

export const jobsOfferAPI = new JobsOfferAPI();

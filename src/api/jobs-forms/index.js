import { apiRequest } from '../../utils/api-request';

class JobsFormsApi {
  async getjobForms() {
    const jobForms = await apiRequest('admin/job-forms', {
      useToken: true,
      method: 'GET',
    });
    return jobForms;
  }

  async getJobForms(id) {
    const JobForms = await apiRequest(`admin/job-forms/${id}`, {
      useToken: true,
      method: 'GET',
    });
    return JobForms;
  }

  async getFormsByJobOfferId(id) {
    const forms = await apiRequest(`admin/job-forms/forms/${id}`, {
      useToken: true,
      method: 'GET',
    });
    return forms;
  }

  async createJobForms(params) {
    const createOffer = await apiRequest('admin/job-forms', {
      useToken: true,
      method: 'POST',
      body: JSON.stringify(params),
    });
    return createOffer;
  }

  async updateJobForms(id, params) {
    const updateOffer = await apiRequest(`admin/job-forms/${id}`, {
      useToken: true,
      method: 'PUT',
      body: JSON.stringify(params),
    });
    return updateOffer;
  }

  async addOrUpdateContentQuestion(id, params) {
    const addOrUpdateContent = apiRequest(`admin/job-forms/forms/${id}`, {
      useToken: true,
      method: 'POST',
      body: JSON.stringify(params),
    });
    return addOrUpdateContent;
  }

  async deleteJobForms(id) {
    const deleteOffer = await apiRequest(`admin/job-forms/${id}`, {
      useToken: true,
      method: 'DELETE',
    });
    return deleteOffer;
  }

  async getJobOfferForms() {
    const jobOfferForms = await apiRequest('admin/job-forms/forms/all', {
      useToken: true,
      method: 'GET',
    });
    return jobOfferForms;
  }

  async associateJobOfferForms(id, params) {
    const associateForms = await apiRequest(
      `admin/job-forms/forms/associate/${id}`,
      {
        useToken: true,
        method: 'POST',
        body: JSON.stringify(params),
      },
    );
    return associateForms;
  }
}

export const jobsFormsAPI = new JobsFormsApi();

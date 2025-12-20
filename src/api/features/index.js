import { apiRequest } from '../../utils/api-request';

class FeaturesApi {
  async getFeatures(request = {}) {
    const {
      page,
      perPage,
      sortBy = 'created_at',
      sortDirection = 'desc',
      filters,
    } = request;
    const result = await apiRequest('admin/features', {
      method: 'GET',
      params: {
        search: filters?.search,
        page: Math.max(1, page + 1),
        perPage,
        sortBy,
        sortDirection,
      },
    });
    return result;
  }

  async getFeature(featureId) {
    const result = await apiRequest(`admin/features/${featureId}`);
    return result;
  }

  async createFeature(feature = {}) {
    const result = await apiRequest('admin/features', {
      method: 'POST',
      body: JSON.stringify(feature),
    });
    return result;
  }

  async updateFeature(id, feature = {}) {
    const result = await apiRequest(`admin/features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feature),
    });
  }

  async deleteFeature(featureId) {
    const result = await apiRequest(`admin/features/${featureId}`, {
      method: 'DELETE',
    });
    return result;
  }
}
export const featuresApi = new FeaturesApi();

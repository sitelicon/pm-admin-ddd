import { apiRequest } from '../../utils/api-request';

class AttributesApi {
  async getAttributes(request = {}) {
    const result = await apiRequest('admin/attributes', {
      method: 'GET',
    });

    return result;
  }
}

export const attributesApi = new AttributesApi();

import { apiRequest } from '../../utils/api-request';

class StoresApi {
  async getStores(request = {}) {
    const result = await apiRequest('admin/stores', {
      method: 'GET',
    });

    return result;
  }
}

export const storesApi = new StoresApi();

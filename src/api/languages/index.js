import { apiRequest } from '../../utils/api-request';

class LanguagesApi {
  async getLanguages(request = {}) {
    const result = await apiRequest('admin/languages', {
      method: 'GET',
    });

    return result;
  }
}

export const languagesApi = new LanguagesApi();

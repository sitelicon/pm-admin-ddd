import { apiRequest } from '../../utils/api-request';

class CountriesAPI {
  async getCountries() {
    const result = await apiRequest('admin/countries', {
      method: 'GET',
    });
    return result;
  }
}

export const countriesAPI = new CountriesAPI();

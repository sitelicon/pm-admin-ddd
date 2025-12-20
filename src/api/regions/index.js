import { apiRequest } from '../../utils/api-request';

class RegionsApi {
  async getRegions() {
    const result = await apiRequest('admin/regions', {
      method: 'GET',
    });
    return result;
  }

  async getRegionsByCountryIso(countryIso) {
    const result = await apiRequest(`admin/regions/${countryIso}`, {
      method: 'GET',
    });
    return result;
  }
}

export const regionsApi = new RegionsApi();

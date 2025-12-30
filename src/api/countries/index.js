import { apiRequest } from '../../utils/api-request';

class CountriesAPI {
  async getCountries(params) {
    console.log(params);
    const { filters, page, perPage, sortBy, sortDir } = params;
    const result = await apiRequest('admin/countries', {
      method: 'GET',
      params: {
        search: filters.search,
        page,
        per_page: perPage,
        sort_by: sortBy,
        order: sortDir,
      },
    });
    return result;
  }

  async createCountry(countryData) {
    const { iso, iso3, name, nicename, postal_code_format, postal_code_regex } =
      countryData;
    const result = await apiRequest('admin/countries', {
      method: 'POST',
      params: {
        iso,
        iso3,
        name,
        nicename,
        postal_code_format,
        postal_code_regex,
      },
    });
    return result;
  }

  async updateCountry(countryId, countryData) {
    const { iso, iso3, name, nicename, postal_code_format, postal_code_regex } =
      countryData;
    const result = await apiRequest(`admin/countries/${countryId}`, {
      method: 'PUT',
      params: {
        iso,
        iso3,
        name,
        nicename,
        postal_code_format,
        postal_code_regex,
      },
    });
    return result;
  }

  async getCountry(countryId) {
    const result = await apiRequest(`admin/countries/${countryId}`, {
      method: 'GET',
    });
    return result;
  }

  async deleteCountry(countryId) {
    const result = await apiRequest(`admin/countries/${countryId}`, {
      method: 'DELETE',
    });
    return result;
  }
}

export const countriesAPI = new CountriesAPI();

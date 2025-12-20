import { apiRequest } from '../../utils/api-request';

class ReportsApi {
  async getSalesReport(filters = {}) {
    const result = await apiRequest('admin/reports/sales', {
      method: 'GET',
      params: filters,
    });

    return result;
  }

  async getProductSalesReport(filters = {}) {
    const result = await apiRequest('admin/reports/productsales', {
      method: 'GET',
      params: filters,
    });

    return result;
  }

  async getCustomersReport(filters = {}) {
    const result = await apiRequest('admin/reports/customers', {
      method: 'GET',
      params: filters,
    });

    return result;
  }

  async getBestsellersReport(filters = {}) {
    const result = await apiRequest('admin/reports/bestsellers', {
      method: 'GET',
      params: filters,
      version: 'v2',
    });

    return result;
  }

  async getRefundsReport(filters = {}) {
    const result = await apiRequest('admin/reports/refunds', {
      method: 'GET',
      params: filters,
    });

    return result;
  }

  async getAccountingReport(filters = {}) {
    const result = await apiRequest('admin/reports/accounting', {
      method: 'GET',
      params: filters,
    });

    return result;
  }

  async getPromotionsReport(filters = {}) {
    const result = await apiRequest('admin/reports/promotions', {
      method: 'GET',
      params: filters,
    });

    return result;
  }

  async getProductsReport(filters = {}) {
    const result = await apiRequest('admin/reports/productssitelicon', {
      method: 'GET',
      params: filters,
    });

    return result;
  }
}

export const reportsApi = new ReportsApi();

import { apiRequest } from '../../utils/api-request';

class GlsApi {
  async testSyncOrder(orderNumber) {
    const result = await apiRequest(`/gls/test/${orderNumber}`);
    return result;
  }

  async forceSyncOrder(orderNumber) {
    const result = await apiRequest(
      `admin/orders/gls/forceSync/${orderNumber}`,
    );
    return result;
  }
}

export const glsApi = new GlsApi();

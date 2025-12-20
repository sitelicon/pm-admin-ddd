import { apiRequest } from '../../utils/api-request';

class CorreosApi {
  async testSyncOrder(orderNumber) {
    const result = await apiRequest(`/correos_express/test/${orderNumber}`);
    return result;
  }

  async forceSyncOrder(orderNumber) {
    const result = await apiRequest(
      `admin/orders/correos_express/forceSync/${orderNumber}`,
    );
    return result;
  }
}

export const correosApi = new CorreosApi();

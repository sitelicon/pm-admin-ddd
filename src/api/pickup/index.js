import { apiRequest } from '../../utils/api-request';

class PickUpStores {
  async getPickUpStores() {
    const result = await apiRequest('admin/pickups/stores', {
      method: 'GET',
    });
    return result;
  }
}

export const pickUpStoresAPI = new PickUpStores();

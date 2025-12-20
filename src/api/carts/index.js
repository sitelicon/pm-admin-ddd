import { apiRequest } from '../../utils/api-request';

class CartsApi {
  async getCarts(request = {}) {
    const { filters, page, perPage, sortBy, sortDir } = request;
    const result = await apiRequest('admin/carts', {
      method: 'GET',
      params: {
        search: filters?.search,
        page: Math.max(1, page + 1),
        perPage: perPage,
        storeId: filters?.storeId,
        groupId: filters?.groupId,
        createdFrom: filters?.createdFrom,
        createdTo: filters?.createdTo,
        sortBy,
        sortDir,
      },
    });

    return result;
  }

  async getCart(cartId) {
    const result = await apiRequest(`admin/carts/${cartId}`);

    return result;
  }
}

export const cartsApi = new CartsApi();

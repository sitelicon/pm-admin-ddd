import { apiRequest } from '../../utils/api-request';
class DiscountsApi {
  async getDiscounts(request = {}) {
    const { filters, page = 0, perPage } = request;

    const response = await apiRequest('admin/discounts', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
      },
    });

    return response;
  }

  async getDiscountById(id) {
    const response = await apiRequest(`admin/discounts/${id}`);
    return response;
  }

  async createDiscount({
    name,
    description,
    active,
    from,
    to,
    type_id,
    value,
    exclude_on_sale_products,
    include_all_categories,
    free_shipping,
    stores,
    customer_groups,
    categories,
  }) {
    const response = await apiRequest('admin/discounts', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        active,
        from,
        to,
        type_id,
        value,
        exclude_on_sale_products,
        include_all_categories,
        free_shipping,
        stores,
        customer_groups,
        categories,
      }),
    });

    return response;
  }

  async updateDiscount({
    id,
    name,
    description,
    active,
    from,
    to,
    type_id,
    value,
    exclude_on_sale_products,
    include_all_categories,
    free_shipping,
    stores,
    customer_groups,
    categories,
  }) {
    const response = await apiRequest(`admin/discounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        description,
        active,
        from,
        to,
        type_id,
        value,
        exclude_on_sale_products,
        include_all_categories,
        free_shipping,
        stores,
        customer_groups,
        categories,
      }),
    });

    return response;
  }

  async deleteDiscount(id) {
    const response = await apiRequest(`admin/discounts/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const discountsApi = new DiscountsApi();

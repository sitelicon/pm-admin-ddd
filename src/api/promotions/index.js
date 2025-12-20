import { apiRequest } from '../../utils/api-request';

class PromotionsApi {
  async getPromotions(request = {}) {
    const { filters, page, perPage } = request;

    const response = await apiRequest('admin/promotions', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
      },
    });

    return response;
  }

  async getPromotionById(id) {
    const response = await apiRequest(`admin/promotions/${id}`);
    return response;
  }

  async createPromotion({
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
    global_uses_limit,
    uses_per_customer,
    coupon_code,
    stores,
    customer_groups,
    categories,
  }) {
    const response = await apiRequest('admin/promotions', {
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
        global_uses_limit,
        uses_per_customer,
        coupon_code,
        stores,
        customer_groups,
        categories,
      }),
    });

    return response;
  }

  async updatePromotion({
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
    global_uses_limit,
    uses_per_customer,
    coupon_code,
    stores,
    customer_groups,
    categories,
  }) {
    const response = await apiRequest(`admin/promotions/${id}`, {
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
        global_uses_limit,
        uses_per_customer,
        coupon_code,
        stores,
        customer_groups,
        categories,
      }),
    });

    return response;
  }

  async deletePromotion(id) {
    const response = await apiRequest(`admin/promotions/${id}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const promotionsApi = new PromotionsApi();

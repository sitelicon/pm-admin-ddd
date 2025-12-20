import { apiRequest } from '../../utils/api-request';

class MenuSettingsApi {
  async getMenuSettings(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir, storeId } = request;

    const response = await apiRequest('admin/menu_settings', {
      method: 'GET',
      params: {
        page: Math.max(1, page + 1),
        perPage,
        status: filters.status,
        order: sortDir,
        orderBy: sortBy,
        storeId,
      },
    });

    return response;
  }

  async getMenuSettingStore(id, storeId) {
    const response = await apiRequest(
      `admin/menu_settings/store/${id}/${storeId}`,
      {
        method: 'GET',
      },
    );

    return response;
  }

  async createMenuSetting(payload) {
    const response = await apiRequest(`admin/menu_settings`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateMenuSetting(id, payload) {
    const { active_background_color, ...rest } = payload;

    const response = await apiRequest(`admin/menu_settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        active_background_color: active_background_color ? 1 : 0,
        ...rest,
      }),
    });

    return response;
  }
}

export const menuSettingsApi = new MenuSettingsApi();

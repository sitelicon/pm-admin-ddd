import { apiRequest } from '../../utils/api-request';

class ColorsApi {
  async getColors() {
    const result = await apiRequest('admin/colors', {
      method: 'GET',
    });
    return result;
  }

  async getColor(colorId) {
    const result = await apiRequest(`admin/colors/${colorId}`);
    return result;
  }

  async createColor(request = {}) {
    const { name_admin, hexadecimal, languages_id, label } = request;
    const result = await apiRequest('admin/colors', {
      method: 'POST',
      body: JSON.stringify({
        name_admin,
        hexadecimal,
        languages_id,
        label,
      }),
    });

    return result;
  }

  async updateColorHex(request = {}) {
    const { id, hexadecimal } = request;
    const result = await apiRequest(`admin/colors/${id}/hex`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        hexadecimal,
      }),
    });

    return result;
  }

  async updateColorNameAdmin(request = {}) {
    const { id, name_admin } = request;
    const result = await apiRequest(`admin/colors/${id}/name`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        name_admin,
      }),
    });

    return result;
  }

  async updateColorLabelAdmin(request = {}) {
    const { id, languages_id, label } = request;
    const result = await apiRequest(`admin/colors/${id}/label`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        languages_id,
        label,
      }),
    });
    return result;
  }

  async eliminateColor(colorId) {
    const result = await apiRequest(`admin/colors/${colorId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: colorId,
      }),
    });
    return result;
  }
}
export const colorsApi = new ColorsApi();

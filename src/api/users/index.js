import { apiRequest } from '../../utils/api-request';

class UsersApi {
  async getUsers(request = {}) {
    const { filters, page, perPage } = request;

    const response = await apiRequest('admin/users', {
      method: 'GET',
      params: {
        id: filters?.id,
        name: filters?.name,
        email: filters?.email,
        search: filters?.search,
        roleId: filters?.roleId,
        page: Math.max(1, page + 1),
        perPage,
      },
    });

    return response;
  }

  async getUser(userId) {
    const response = await apiRequest(`admin/users/${userId}`);

    return response;
  }

  async updateUser(userId, request = {}) {
    const { name, email, password, roleId, edit_order_status } = request;

    const response = await apiRequest(`admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
        email,
        password,
        user_role_id: roleId,
        edit_order_status,
      }),
    });

    return response;
  }

  async createUser(request = {}) {
    const { name, email, password, roleId } = request;

    const response = await apiRequest('admin/users', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        user_role_id: roleId,
      }),
    });

    return response;
  }

  async deleteUser(userId) {
    const response = await apiRequest(`admin/users/${userId}`, {
      method: 'DELETE',
    });

    return response;
  }

  async deleteUsers(usersIds) {
    const response = await apiRequest('admin/users', {
      method: 'DELETE',
      body: JSON.stringify({ ids: usersIds }),
    });

    return response;
  }

  async getRoles() {
    const response = await apiRequest('admin/roles', {
      method: 'GET',
      params: {
        sort_by: 'name',
        order: 'asc',
      },
    });

    return response;
  }

  async getRole(roleId) {
    const response = await apiRequest(`admin/roles/${roleId}`);

    return response;
  }

  async createRole(request = {}) {
    const response = await apiRequest('admin/roles', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response;
  }

  async updateRole(roleId, request = {}) {
    const response = await apiRequest(`admin/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return response;
  }

  async deleteRole(roleId) {
    const response = await apiRequest(`admin/roles/${roleId}`, {
      method: 'DELETE',
    });

    return response;
  }
}

export const usersApi = new UsersApi();

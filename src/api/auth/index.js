import { apiRequest } from '../../utils/api-request';

class AuthApi {
  async signIn(request) {
    const { email, password } = request;

    const response = await apiRequest('admin/login', {
      method: 'POST',
      useToken: false,
      body: JSON.stringify({
        email,
        password,
      }),
    });

    return { accessToken: response.token };
  }

  async signUp(request) {
    const { email, name, password } = request;

    return apiRequest('admin/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    });
  }

  async signOut() {
    return apiRequest('admin/logout', {
      method: 'POST',
    });
  }

  async me() {
    return apiRequest('admin/me');
  }

  async forgotPassword(request) {
    const { email } = request;
    return apiRequest('admin/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    });
  }

  async resetPassword(request) {
    const { token, email, password, confirm_password } = request;

    return apiRequest('admin/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token,
        email,
        password,
        confirm_password,
      }),
    });
  }
}

export const authApi = new AuthApi();

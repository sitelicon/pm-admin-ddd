import { apiRequest } from '../../utils/api-request';
import axios from 'axios';

const STORAGE_KEY = 'accessToken';

class UploadApi {
  async upload(formData) {
    const token = globalThis.localStorage.getItem(STORAGE_KEY);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response;
  }
}

export const uploadApi = new UploadApi();

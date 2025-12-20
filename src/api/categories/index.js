import axios from 'axios';
import { apiRequest } from '../../utils/api-request';

class CategoriesApi {
  async getCategories(request = {}) {
    const { filters } = request;
    const result = await apiRequest('admin/categories', {
      method: 'GET',
      params: {
        level: 1,
      },
    });

    return result;
  }

  async getCategory(categoryId, filters = undefined) {
    const result = await apiRequest(`admin/categories/${categoryId}`, {
      method: 'GET',
      params: filters,
    });

    return result;
  }

  async updateProductPosition(id, position) {
    const result = await apiRequest('admin/categories/product/position', {
      method: 'PUT',
      body: JSON.stringify({
        id,
        position,
      }),
    });

    return result;
  }

  async bulkUpdateProductPosition(data = []) {
    const result = await apiRequest('admin/categories/product/bulk/position', {
      method: 'PUT',
      body: JSON.stringify({
        data,
      }),
    });

    return result;
  }

  async createCategory(request = {}) {
    const result = await apiRequest('admin/categories', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return result;
  }

  async updateCategory(categoryId, request = {}) {
    const result = await apiRequest(`admin/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return result;
  }

  async updateCategoryPosition(categoryId, request = {}) {
    const result = await apiRequest(`admin/categories/${categoryId}/position`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });

    return result;
  }

  async deleteProduct(categoryId, productId) {
    const result = await apiRequest('admin/categories/product/delete', {
      method: 'DELETE',
      body: JSON.stringify({
        category_id: categoryId,
        product_id: productId,
      }),
    });

    return result;
  }

  async deleteBulkProduct(categoryId, productIds = []) {
    const result = await apiRequest('admin/categories/product/bulk/delete', {
      method: 'DELETE',
      body: JSON.stringify({
        category_id: categoryId,
        product_ids: productIds,
      }),
    });
    return result;
  }

  async deleteCategory(categoryId) {
    const result = await apiRequest(`admin/categories/${categoryId}`, {
      method: 'DELETE',
    });

    return result;
  }

  async getCategoriesImagesList() {
    const result = await apiRequest(`admin/category-images`, {
      method: 'GET',
    });

    return result;
  }

  async getImagesFromCategories(categoryId, languajeId) {
    const result = await apiRequest(
      `admin/category-images/admin/${categoryId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          language_id: languajeId,
        }),
      },
    );

    return result;
  }

  async updateImageFromCategory(id, data) {
    const formData = new FormData();
    formData.append('language_id', data.language_id);
    formData.append('category_id', data.category_id);
    if (data.src) {
      formData.append('src', data.src, data.src.name);
    }
    formData.append('title', data.title);
    formData.append('alt', data.alt);
    formData.append('order', data.order);
    formData.append('path', data.path);
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/category-images/${id}`,
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

  async getImagesByCategoryId(categoryId) {
    const result = await apiRequest(
      `admin/categories-images/category/${categoryId}`,
      {
        method: 'GET',
        version: 'v2',
      },
    );

    return result;
  }

  async createImageCategory(request = {}) {
    const formData = new FormData();
    formData.append('button_id', request.button_id);
    formData.append('category_id', request.category_id);
    formData.append('store_id', request.store_id);
    formData.append('display_order', request.display_order);
    formData.append('tag', request.tag);

    if (request.image) {
      formData.append('src', request.image);
    }

    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/admin/categories-images`,
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

  async deleteImageCategory(id) {
    const result = await apiRequest(`admin/categories-images/${id}`, {
      method: 'DELETE',
      version: 'v2',
    });

    return result;
  }

  async updateCategoryImage(id, request = {}) {
    const formData = new FormData();
    formData.append('button_id', request.button_id);
    formData.append('category_id', request.category_id);
    formData.append('store_id', request.store_id);
    formData.append('display_order', request.display_order);
    formData.append('tag', request.tag);

    if (request.image) {
      formData.append('src', request.image);
    }

    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/admin/categories-images/${id}`,
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

export const categoriesApi = new CategoriesApi();

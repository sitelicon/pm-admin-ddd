import axios from 'axios';
import { apiRequest } from '../../utils/api-request';

const STORAGE_KEY = 'accessToken';

class ProductsApi {
  async getProducts(request = {}) {
    const { filters, page, perPage } = request;
    const result = await apiRequest('admin/products', {
      method: 'GET',
      params: {
        search: filters?.search,
        name: filters?.name,
        sku: filters?.sku,
        skuOrRef: filters?.skuOrRef,
        categoryId: filters?.categoryId,
        categoryIds: filters?.categoryIds,
        draft: filters?.draft,
        minPrice: filters?.minPrice,
        maxPrice: filters?.maxPrice,
        minDiscountPrice: filters?.minDiscountPrice,
        maxDiscountPrice: filters?.maxDiscountPrice,
        minStock: filters?.minStock,
        maxStock: filters?.maxStock,
        page: Math.max(1, page + 1),
        perPage,
        sort: filters?.sort ? filters.sort.split(':')[0] : 'created_at',
        order: filters?.sort ? filters.sort.split(':')[1] : 'asc',
      },
    });

    return result;
  }

  async createProduct(request = {}) {
    const { sku } = request;
    const result = await apiRequest('admin/products', {
      method: 'POST',
      body: JSON.stringify({
        sku,
      }),
    });

    return result;
  }

  async getProduct(productId) {
    const result = await apiRequest(`admin/products/${productId}`);

    return result;
  }

  async getTopSellingProducts(from, to, storeId) {
    const result = await apiRequest('admin/dashboard', {
      method: 'GET',
      params: {
        from,
        to,
        storeId,
      },
    });

    return result;
  }

  async updateProductPrice(request = {}) {
    const result = await apiRequest('admin/products/prices', {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return result;
  }

  async updateProductAttributes(request = {}) {
    const result = await apiRequest('admin/products/attributes', {
      method: 'PUT',
      version: 'v2',
      body: JSON.stringify(request),
    });

    return result;
  }

  async updateProductCategories(request = {}) {
    const result = await apiRequest('admin/products/categories', {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return result;
  }

  async updateProductStores(request = {}) {
    const result = await apiRequest('admin/products/stores', {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return result;
  }

  async uploadImages(productId, files = []) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file, file.name);
    });

    const token = globalThis.localStorage.getItem(STORAGE_KEY);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/products/${productId}/images`,
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

  async updateImage(imageId, request = {}) {
    const result = await apiRequest(`admin/products/images/${imageId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return result;
  }

  async updateImagePriority(request = []) {
    const result = await apiRequest(`admin/products/priority`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return result;
  }

  async deleteImage(imageId) {
    const result = await apiRequest(`admin/products/images/${imageId}`, {
      method: 'DELETE',
    });

    return result;
  }

  async deleteProduct(productId) {
    const result = await apiRequest(`admin/products/${productId}`, {
      method: 'DELETE',
    });

    return result;
  }

  async addProductToProductGroup(request = {}) {
    const result = await apiRequest(`admin/product-groups`, {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return result;
  }

  async deleteProductFromProductGroup(groupId, productId) {
    const result = await apiRequest(`admin/product-groups/${groupId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        productId,
      }),
    });

    return result;
  }

  async switchProductGroupProductDefault(groupId, productId) {
    const result = await apiRequest(
      `admin/product-groups/${groupId}/toggle-default`,
      {
        method: 'PUT',
        body: JSON.stringify({
          productId,
        }),
      },
    );

    return result;
  }

  async bulkEnableProducts(productsIds = []) {
    const result = await apiRequest(`admin/products/bulk/enable`, {
      method: 'POST',
      body: JSON.stringify({
        productsIds,
      }),
    });

    return result;
  }

  async bulkDisableProducts(productsIds = []) {
    const result = await apiRequest(`admin/products/bulk/disable`, {
      method: 'POST',
      body: JSON.stringify({
        productsIds,
      }),
    });

    return result;
  }

  async updateOrderGroupProducts(group, request = []) {
    const result = await apiRequest(`admin/product-groups/${group}/order`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });

    return result;
  }
}

export const productsApi = new ProductsApi();

import axios from 'axios';
import { apiRequest } from '../../utils/api-request';

class LandingPageApi {
  async getLandingPages(request = {}) {
    const { filters, page = 0, perPage, sortBy, sortDir, storeId } = request;

    const response = await apiRequest('admin/landing/landing', {
      method: 'POST',
      body: JSON.stringify({
        page,
        perPage,
        sortBy,
        sortDir,
        filters,
        store: storeId,
      }),
    });

    return response;
  }

  async getLandingPage(id) {
    const response = await apiRequest(`admin/landing/${id}`, {
      method: 'GET',
    });

    return response;
  }

  async createLandingPage(payload) {
    const response = await apiRequest(`admin/landing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response;
  }

  async updateLandingPage(id, data) {
    const response = await apiRequest(`admin/landing/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response;
  }

  async updateOrder(id, updateOrder) {
    const response = await apiRequest(`admin/landing/${id}/update-order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: updateOrder }),
    });

    return response;
  }

  async deleteLandingPage(id) {
    const response = await apiRequest(`admin/landing/${id}`, {
      method: 'DELETE',
    });
    return response;
  }

  async createHeaderLandingPage(id, data) {
    if (data.image_url && data.image_url instanceof File) {
      const formData = new FormData();
      formData.append('background_color', data.background_color);
      formData.append('button_id', data.button_id);
      formData.append('title', data.title);
      formData.append('order', data.order);
      formData.append('language_id', data.language_id);
      formData.append('image_url', data.image_url, data.image_url.name);
      formData.append('is_mobile', data.is_mobile);
      formData.append('is_tablet', data.is_tablet);

      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/landing/${id}/headers`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error; // Re-lanza el error si deseas manejarlo más adelante
      }
    } else {
      const response = await apiRequest(`admin/landing/${id}/headers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    }
  }

  async updateHeaderLandingPage(idLanding, id, data) {
    const token = localStorage.getItem('accessToken');

    if (data.image_url && data.image_url instanceof File) {
      const formDataUpdate = new FormData();
      formDataUpdate.append('button_id', data.button_id);
      formDataUpdate.append('title', data.title);
      formDataUpdate.append('order', data.order);
      formDataUpdate.append('background_color', data.background_color);

      formDataUpdate.append('is_mobile', data.is_mobile);
      formDataUpdate.append('is_tablet', data.is_tablet);

      formDataUpdate.append('guide_gift_page_id', data.guide_gift_page_id);
      formDataUpdate.append('image_url', data.image_url, data.image_url.name);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/landing/${idLanding}/headers/${id}`,
          formDataUpdate,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        return response.data;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error;
      }
    } else {
      try {
        const response = await apiRequest(
          `admin/landing/${idLanding}/headers/${id}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`, // Añadir token al segundo caso
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );
        return response;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error;
      }
    }
  }

  async deleteHeaderLandingPage(idLanding, id) {
    const response = await apiRequest(
      `admin/landing/${idLanding}/headers/${id}`,
      {
        method: 'DELETE',
      },
    );
    return response;
  }

  async createBoxLandingPage(id, data) {
    if (data.type_box) data.type = data.type_box;
    const response = await apiRequest(`admin/landing/${id}/boxes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  async updateBoxLandingPage(idLanding, id, data) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await apiRequest(
        `admin/landing/${idLanding}/boxes/${id}/`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`, // Añadir token al segundo caso
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      return response;
    } catch (error) {
      console.error(
        'Error al hacer la solicitud:',
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  }

  async deleteBoxLandingPage(idLanding, id) {
    const response = await apiRequest(
      `admin/landing/${idLanding}/boxes/${id}`,
      {
        method: 'DELETE',
      },
    );
    return response;
  }

  async createLandingPageBoxItem(idLanding, idBox, data) {
    if (data.image_url && data.image_url instanceof File) {
      const formData = new FormData();
      formData.append('boxes_landing_id', data.boxes_landing_id);
      formData.append('button_id', data.button_id);
      formData.append('link', data.link);
      formData.append('order', data.order);
      formData.append('is_mobile', data.is_mobile);
      formData.append('is_tablet', data.is_tablet);
      formData.append('image_url', data.image_url, data.image_url.name);
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/landing/${idLanding}/boxes/${idBox}/items`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error; // Re-lanza el error si deseas manejarlo más adelante
      }
    }
  }

  async updateLandingPageBoxItem(idLanding, idBox, idItem, data) {
    const token = localStorage.getItem('accessToken');

    if (data.image_url && data.image_url instanceof File) {
      const formDataUpdate = new FormData();
      formDataUpdate.append('boxes_landing_id', data.boxes_landing_id);
      formDataUpdate.append('button_id', data.button_id);
      formDataUpdate.append('link', data.link);
      formDataUpdate.append('order', data.order);

      formDataUpdate.append('is_mobile', data.is_mobile);
      formDataUpdate.append('is_tablet', data.is_tablet);

      formDataUpdate.append('image_url', data.image_url, data.image_url.name);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/landing/${idLanding}/boxes/${idBox}/items/${idItem}`,
          formDataUpdate,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        return response.data;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error;
      }
    } else {
      try {
        const response = await apiRequest(
          `admin/landing/${idLanding}/boxes/${idBox}/items/${idItem}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`, // Añadir token al segundo caso
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );
        return response;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error;
      }
    }
  }

  async deleteLandingPageBoxItem(idLanding, idBox, idItem) {
    const response = await apiRequest(
      `admin/landing/${idLanding}/boxes/${idBox}/items/${idItem}`,
      {
        method: 'DELETE',
      },
    );
    return response;
  }

  async createCarrouselLandingPage(id, data) {
    if (data.image_url && data.image_url instanceof File) {
      const formData = new FormData();
      formData.append('background_color', data.background_color);
      formData.append('button_id', data.button_id);
      formData.append('order', data.order);
      formData.append('guide_gift_page_id', data.guide_gift_page_id);
      formData.append('image_url', data.image_url, data.image_url.name);
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/landing/${id}/carrousel`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error; // Re-lanza el error si deseas manejarlo más adelante
      }
    } else {
      const response = await apiRequest(`admin/landing/${id}/carrousel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    }
  }

  async updateCarrouselLandingPage(landingId, id, data) {
    const token = localStorage.getItem('accessToken');
    if (data.image_url && data.image_url instanceof File) {
      const formData = new FormData();
      formData.append('background_color', data.background_color);
      formData.append('button_id', data.button_id);
      formData.append('order', data.order);
      formData.append('guide_gift_page_id', data.guide_gift_page_id);
      formData.append('image_url', data.image_url, data.image_url.name);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/landing/${landingId}/carrousel/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error;
      }
    } else {
      const response = await apiRequest(
        `admin/landing/${landingId}/carrousel/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      return response;
    }
  }

  async deleteCarrouselLandingPage(idLanding, id) {
    const response = await apiRequest(
      `admin/landing/${idLanding}/carrousel/${id}`,
      {
        method: 'DELETE',
      },
    );
    return response;
  }

  async createLandingPageCarrouselItem(idLanding, idCarrousel, data) {
    if (data.url && data.url instanceof File) {
      const formData = new FormData();
      formData.append('boxes_landing_id', data.boxes_landing_id);
      formData.append('button_id', data.button_id);
      formData.append('link', data.link);
      formData.append('order', data.order);

      formData.append('is_mobile', data.is_mobile);
      formData.append('is_tablet', data.is_tablet);

      formData.append('url', data.url, data.url.name);
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/landing/${idLanding}/carrousel/${idCarrousel}/items`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        return response;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error; // Re-lanza el error si deseas manejarlo más adelante
      }
    }
  }

  async updateLandingPageCarrouselItem(idLanding, idCarrousel, idItem, data) {
    const token = localStorage.getItem('accessToken');

    if (data.url && data.url instanceof File) {
      const formDataUpdate = new FormData();
      formDataUpdate.append('boxes_landing_id', data.boxes_landing_id);
      formDataUpdate.append('button_id', data.button_id);
      formDataUpdate.append('link', data.link);
      formDataUpdate.append('order', data.order);
      formDataUpdate.append('is_mobile', data.is_mobile);
      formDataUpdate.append('is_tablet', data.is_tablet);
      formDataUpdate.append('url', data.url, data.url.name);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/admin/landing/${idLanding}/carrousel/${idCarrousel}/items/${idItem}`,
          formDataUpdate,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        return response.data;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error;
      }
    } else {
      try {
        const response = await apiRequest(
          `admin/landing/${idLanding}/carrousel/${idCarrousel}/items/${idItem}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`, // Añadir token al segundo caso
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );
        return response;
      } catch (error) {
        console.error(
          'Error al hacer la solicitud:',
          error.response ? error.response.data : error.message,
        );
        throw error;
      }
    }
  }

  async deleteLandingPageCarrouselItem(idLanding, idCarrousel, idItem) {
    const response = await apiRequest(
      `admin/landing/${idLanding}/carrousel/${idCarrousel}/items/${idItem}`,
      {
        method: 'DELETE',
      },
    );
    return response;
  }
}

export const landingPageApi = new LandingPageApi();

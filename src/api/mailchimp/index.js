import { apiRequest } from '../../utils/api-request';

class MailchimpApi {
  async getCampaings(search) {
    try {
      const offset = search.page * search.perPage;
      const response = await apiRequest('admin/mailchimp/campaings', {
        method: 'POST',
        body: JSON.stringify({
          offset,
          per_page: search.perPage,
        }),
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getCampaign(campaignId) {
    try {
      const response = await apiRequest(
        `admin/mailchimp/campaings/${campaignId}`,
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async duplicateCampaign(campaignId) {
    try {
      const response = await apiRequest(
        `admin/mailchimp/campaings/${campaignId}/duplicate`,
        {
          method: 'POST',
        },
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getCampaignBBDD(campaignId) {
    try {
      const response = await apiRequest(
        `admin/mailchimp/campaings/${campaignId}/bbdd`,
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async updateCampaignBBDD(campaignId, body) {
    try {
      const response = await apiRequest(
        `admin/mailchimp/campaings/${campaignId}/bbdd`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async createCampaignBBDD(data) {
    try {
      const response = await apiRequest('admin/mailchimp/campaings/bbdd', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export const mailchimpApi = new MailchimpApi();

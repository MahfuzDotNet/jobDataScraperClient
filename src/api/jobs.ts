import apiClient from './client';

export interface Job {
  company: string;
  position: string;
  phone_number: string;
  email: string;
  category: string;
  posting_date: string;
  scraping_date: string;
  location: string;
  job_link: string;
  description: string;
  source: string;
  website: string;
  salary: string;
  job_type: string;
  jobpost_ad_id: string;
  colleague_user_id: string;
}

export interface ScrapeRequest {
  url_to_scrape: string;
  max_pages: number;
  category: string;
}

export const jobsAPI = {
  scrapeJobs: async (request: ScrapeRequest) => {
    const response = await apiClient.post('/scrape', request);
    return response.data;
  },

  getJobs: async () => {
    const response = await apiClient.get('/jobs');
    return response.data;
  },

  deleteAllJobs: async () => {
    const response = await apiClient.delete('/jobs');
    return response.data;
  },

  downloadExcel: async () => {
    const response = await apiClient.get('/download_excel', {
      responseType: 'blob',
    });
    return response.data;
  },
};

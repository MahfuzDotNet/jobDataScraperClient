import apiClient from './client';

export interface Job {
  company: string;
  position: string;
  category: string;
  posting_date: string;
  location: string;
  salary: string;
  job_type: string;
  phone_number: string;
  job_link: string;
  description: string;
  website: string;
  scraping_date: string;
  source: string;
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

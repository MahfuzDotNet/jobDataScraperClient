import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { jobsAPI } from '@/api/jobs';
import type { Job } from '@/api/jobs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileDown, Trash2, ExternalLink, Loader2 } from 'lucide-react';

export default function Results() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsAPI.getJobs,
  });

  const deleteMutation = useMutation({
    mutationFn: jobsAPI.deleteAllJobs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const handleDownload = async () => {
    try {
      const blob = await jobsAPI.downloadExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job_listings_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download Excel file:', err);
    }
  };

  const jobs: Job[] = data?.jobs || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load jobs. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Data Scraping</h1>
            <p className="text-lg font-semibold mt-1">
              Jobs Position: {jobs.length}
            </p>
          </div>
          <div className="flex gap-2">
            {jobs.length > 0 && (
              <>
                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Excel
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate()}
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All Jobs
                </Button>
              </>
            )}
          </div>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">
                No job listings found. Start scraping to see results here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Position</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Phone Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Posted On</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Data Scraped On</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Post Web Link</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Source</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Website</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Salary</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Job Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">JobPost Ad ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Colleague-User ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm">{job.company || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-medium">{job.position || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{job.phone_number || 'Not provided'}</td>
                    <td className="px-4 py-3 text-sm">{job.email || 'Not provided'}</td>
                    <td className="px-4 py-3 text-sm">{job.category || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{job.posting_date || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{job.scraping_date || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{job.location || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      {job.job_link ? (
                        <a
                          href={job.job_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          View Job <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs">
                      <div className="line-clamp-2" title={job.description}>
                        {job.description ? job.description.substring(0, 100) + '...' : 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{job.source || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      {job.website ? (
                        <a
                          href={job.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {new URL(job.website).hostname}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{job.salary || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{job.job_type || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{job.jobpost_ad_id || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{job.colleague_user_id || 'N/A'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { jobsAPI } from '@/api/jobs';
import type { Job } from '@/api/jobs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
            <h1 className="text-3xl font-bold">Job Listings</h1>
            <p className="text-muted-foreground mt-1">
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </p>
          </div>
          <div className="flex gap-2">
            {jobs.length > 0 && (
              <>
                <Button onClick={handleDownload} variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Excel
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate()}
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All
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
          <div className="grid gap-4">
            {jobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.position}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {job.company}
                        </CardDescription>
                      </div>
                      <a
                        href={job.job_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        View Job <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Location:</span> {job.location}
                      </div>
                      <div>
                        <span className="font-medium">Salary:</span> {job.salary}
                      </div>
                      <div>
                        <span className="font-medium">Job Type:</span> {job.job_type}
                      </div>
                      <div>
                        <span className="font-medium">Posted:</span> {job.posting_date}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {job.category}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {job.phone_number}
                      </div>
                    </div>
                    {job.description && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                      </div>
                    )}
                    <div className="mt-4 text-xs text-muted-foreground">
                      Source: {job.source} | Scraped: {job.scraping_date}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

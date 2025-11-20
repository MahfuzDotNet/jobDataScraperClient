import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { jobsAPI } from '@/api/jobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const JOB_WEBSITES = [
  { value: 'http://www.kosovajob.com/', label: 'KosovaJob (www.kosovajob.com)' },
  { value: 'https://ofertapune.net/', label: 'Oferta Pune (ofertapune.net)' },
  { value: 'https://jobs.telegrafi.com/', label: 'Telegrafi Jobs (jobs.telegrafi.com)' },
  { value: 'https://www.portalpune.com/', label: 'Portal Pune (www.portalpune.com)' },
  { value: 'custom', label: 'Custom URL' },
];

const scrapeSchema = z.object({
  url_to_scrape: z.string().url('Please enter a valid URL'),
  max_pages: z.number().min(1).max(10),
  category: z.string().min(1, 'Category is required'),
});

type ScrapeForm = z.infer<typeof scrapeSchema>;

export default function SelectUrl() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [selectedWebsite, setSelectedWebsite] = useState<string>('http://www.kosovajob.com/');
  const [showCustomUrl, setShowCustomUrl] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ScrapeForm>({
    resolver: zodResolver(scrapeSchema),
    defaultValues: {
      url_to_scrape: 'http://www.kosovajob.com/',
      max_pages: 1,
      category: 'General',
    },
  });

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedWebsite(value);
    if (value === 'custom') {
      setShowCustomUrl(true);
      setValue('url_to_scrape', '');
    } else {
      setShowCustomUrl(false);
      setValue('url_to_scrape', value);
    }
  };

  const scrapeMutation = useMutation({
    mutationFn: jobsAPI.scrapeJobs,
    onSuccess: (data) => {
      navigate('/results', { state: { jobCount: data.count } });
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to scrape jobs. Please try again.');
    },
  });

  const onSubmit = (data: ScrapeForm) => {
    setError('');
    scrapeMutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Start Web Scraping</CardTitle>
            <CardDescription>
              Enter the URL of the job listing page you want to scrape
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="website">Select Job Website</Label>
                <select
                  id="website"
                  value={selectedWebsite}
                  onChange={handleWebsiteChange}
                  disabled={scrapeMutation.isPending}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {JOB_WEBSITES.map((site) => (
                    <option key={site.value} value={site.value}>
                      {site.label}
                    </option>
                  ))}
                </select>
                {errors.url_to_scrape && (
                  <p className="text-sm text-destructive">{errors.url_to_scrape.message}</p>
                )}
              </div>

              {showCustomUrl && (
                <div className="space-y-2">
                  <Label htmlFor="custom_url">Custom URL</Label>
                  <Input
                    id="custom_url"
                    placeholder="https://example.com/jobs"
                    {...register('url_to_scrape')}
                    disabled={scrapeMutation.isPending}
                  />
                  {errors.url_to_scrape && (
                    <p className="text-sm text-destructive">{errors.url_to_scrape.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Technology, Marketing, etc."
                  {...register('category')}
                  disabled={scrapeMutation.isPending}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pages">Maximum Pages to Scrape</Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  max="10"
                  {...register('max_pages', { valueAsNumber: true })}
                  disabled={scrapeMutation.isPending}
                />
                {errors.max_pages && (
                  <p className="text-sm text-destructive">{errors.max_pages.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Limit: 1-10 pages per scraping session
                </p>
              </div>

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              {scrapeMutation.isPending && (
                <div className="p-4 bg-blue-50 rounded-md">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <div>
                      <p className="font-medium">Scraping in progress...</p>
                      <p className="text-sm text-muted-foreground">
                        Please wait while we extract job listings from the website
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={scrapeMutation.isPending}>
                {scrapeMutation.isPending ? 'Scraping...' : 'Start Scraping'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

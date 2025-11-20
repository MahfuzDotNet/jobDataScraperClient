import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Database, FileDown } from 'lucide-react';

export default function Welcome() {
  const username = useSelector((state: RootState) => state.auth.username);

  const features = [
    {
      icon: Search,
      title: 'Web Scraping',
      description: 'Extract job listings from any website URL with advanced parsing algorithms',
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'View, manage, and organize all your scraped job listings in one place',
    },
    {
      icon: FileDown,
      title: 'Export to Excel',
      description: 'Download your data in professional Excel format with custom formatting',
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {username}!</h1>
          <p className="text-muted-foreground">
            Start scraping job listings from websites with ease
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <feature.icon className="h-12 w-12 mb-4 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Link to="/scrape">
            <Button size="lg">Start Scraping</Button>
          </Link>
          <Link to="/results">
            <Button size="lg" variant="outline">
              View Results
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '@/store/authSlice';
import { authAPI } from '@/api/auth';
import type { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(clearAuth());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/welcome" className="text-xl font-bold">
              Data Scraping
            </Link>
            <div className="hidden md:flex gap-4">
              <Link to="/welcome" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/scrape" className="text-sm hover:text-primary transition-colors">
                Start
              </Link>
              <Link to="/results" className="text-sm hover:text-primary transition-colors">
                Previous Records
              </Link>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2024 URL Based Job Data Scraping
        </div>
      </footer>
    </div>
  );
}

import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/api/auth';
import { setAuth, clearAuth } from '@/store/authSlice';
import type { RootState } from '@/store';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { data, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authAPI.getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (data?.authenticated) {
      dispatch(setAuth({ username: data.username }));
    } else if (error) {
      dispatch(clearAuth());
    }
  }, [data, error, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.authenticated || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

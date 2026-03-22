import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/appwrite';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const account = await getCurrentUser();
        setUser(account);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-violet animate-spin" />
      </div>
    );
  }

  // If there's NO user authenticated, bounce them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authorized, render the admin dashboard directly
  return children;
};

export default ProtectedRoute;

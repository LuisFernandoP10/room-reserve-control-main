
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Wrap the navigation in a setTimeout to ensure it happens after the router is fully initialized
    const redirectTimer = setTimeout(() => {
      navigate('/dashboard');
    }, 50);
    
    // Clean up the timer if the component unmounts before the timeout completes
    return () => clearTimeout(redirectTimer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecionando...</p>
    </div>
  );
};

export default Index;

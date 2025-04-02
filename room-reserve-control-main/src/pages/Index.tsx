import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verificar se a API está disponível
    const checkApiConnection = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
        const response = await fetch(`${apiUrl}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Adicionando um timeout mais curto para evitar espera prolongada
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          console.log("API conectada com sucesso");
          toast.success("Conexão com API estabelecida");
        } else {
          console.warn("API indisponível, usando dados mockados");
          toast.warning("API indisponível, usando dados mockados");
        }
      } catch (error) {
        console.warn("API indisponível, usando dados mockados:", error);
        toast.warning("API indisponível, usando dados mockados");
      } finally {
        // Wrap the navigation in a setTimeout to ensure it happens after the router is fully initialized
        const redirectTimer = setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard');
        }, 500);
        
        // Clean up the timer if the component unmounts before the timeout completes
        return () => clearTimeout(redirectTimer);
      }
    };
    
    checkApiConnection();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
        <p className="text-lg text-gray-600">Inicializando aplicação...</p>
        <p className="text-sm text-muted-foreground mt-2">Verificando conexão com a API</p>
      </div>
    </div>
  );
};

export default Index;

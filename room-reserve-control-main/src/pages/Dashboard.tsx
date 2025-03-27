
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from '@/components/dashboard/FilterBar';
import RoomList from '@/components/dashboard/RoomList';
import { RoomFilters } from '@/types';
import PageTransition from '@/components/layout/PageTransition';
import { PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<RoomFilters>({});
  
  const handleFiltersChange = (newFilters: RoomFilters) => {
    setFilters(newFilters);
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Salas Acadêmicas</h1>
            <p className="text-muted-foreground">
              Visualize e reserve salas para suas atividades acadêmicas
            </p>
          </div>
          
          <Link
            to="/reservations/new"
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Nova Reserva</span>
          </Link>
        </div>
        
        <FilterBar onFiltersChange={handleFiltersChange} />
        
        <RoomList filters={filters} />
      </div>
    </PageTransition>
  );
};

export default Dashboard;


import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import ReservationList from '@/components/reservations/ReservationList';
import ReservationForm from '@/components/reservations/ReservationForm';
import PageTransition from '@/components/layout/PageTransition';
import { CalendarPlus, ChevronLeft } from 'lucide-react';

const ReservationsPage: React.FC = () => {
  const location = useLocation();
  const isNewRoute = location.pathname.includes('/new');

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isNewRoute ? 'Nova Reserva' : 'Minhas Reservas'}
            </h1>
            <p className="text-muted-foreground">
              {isNewRoute 
                ? 'Preencha o formulário para reservar uma sala'
                : 'Gerencie suas reservas de salas acadêmicas'
              }
            </p>
          </div>
          
          {isNewRoute ? (
            <Link
              to="/reservations"
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors border"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Voltar para reservas</span>
            </Link>
          ) : (
            <Link
              to="/reservations/new"
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors shadow-sm"
            >
              <CalendarPlus className="h-5 w-5" />
              <span>Nova Reserva</span>
            </Link>
          )}
        </div>
        
        <Routes>
          <Route path="/" element={<ReservationList />} />
          <Route path="/new" element={<ReservationForm />} />
        </Routes>
      </div>
    </PageTransition>
  );
};

export default ReservationsPage;

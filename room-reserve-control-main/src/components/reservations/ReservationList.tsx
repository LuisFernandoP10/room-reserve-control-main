
import React, { useState, useEffect } from 'react';
import { Reservation } from '@/types';
import apiClient from '@/services/api';
import { CalendarDays, Clock, Loader2, MapPin, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getReservations();
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast.error('Não foi possível carregar as reservas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, []);
  
  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await apiClient.deleteReservation(id);
      setReservations(prev => prev.filter(reservation => reservation.id !== id));
      toast.success('Reserva cancelada com sucesso');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Não foi possível cancelar a reserva');
    } finally {
      setDeleting(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Carregando reservas...</p>
      </div>
    );
  }
  
  if (!reservations.length) {
    return (
      <div className="bg-secondary rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhuma reserva encontrada</h3>
        <p className="text-muted-foreground mb-4">
          Você ainda não possui reservas agendadas.
        </p>
        <a
          href="/reservations/new"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Criar nova reserva
        </a>
      </div>
    );
  }
  
  // Group reservations by date
  const groupedReservations: Record<string, Reservation[]> = {};
  reservations.forEach(reservation => {
    if (!groupedReservations[reservation.date]) {
      groupedReservations[reservation.date] = [];
    }
    groupedReservations[reservation.date].push(reservation);
  });
  
  // Sort dates in ascending order
  const sortedDates = Object.keys(groupedReservations).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  
  return (
    <div className="space-y-8">
      {sortedDates.map(date => (
        <div key={date} className="animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            {format(parseISO(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          
          <div className="space-y-4">
            {groupedReservations[date].map(reservation => (
              <div 
                key={reservation.id} 
                className="bg-white rounded-lg border shadow-sm overflow-hidden card-hover"
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h4 className="font-medium text-lg">{reservation.purpose}</h4>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {reservation.startTime} - {reservation.endTime}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {reservation.roomName}, {reservation.blockName}
                    </span>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors",
                        deleting === reservation.id && "opacity-50 pointer-events-none"
                      )}
                      disabled={deleting === reservation.id}
                    >
                      {deleting === reservation.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span>Cancelar Reserva</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;

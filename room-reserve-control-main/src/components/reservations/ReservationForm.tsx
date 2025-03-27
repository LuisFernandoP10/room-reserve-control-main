
import React, { useState, useEffect } from 'react';
import { Room, ReservationFormData } from '@/types';
import apiClient from '@/services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ReservationForm: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ReservationFormData>({
    roomId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '08:00',
    endTime: '10:00',
    purpose: '',
  });
  
  // Get the roomId from URL params if available
  useEffect(() => {
    const roomId = searchParams.get('roomId');
    if (roomId) {
      setFormData(prev => ({ ...prev, roomId }));
    }
  }, [searchParams]);
  
  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await apiClient.getRooms();
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Não foi possível carregar as salas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.roomId || !formData.date || !formData.startTime || !formData.endTime || !formData.purpose) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setSubmitting(true);
      await apiClient.createReservation(formData);
      toast.success('Reserva criada com sucesso!');
      navigate('/reservations');
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Não foi possível criar a reserva. Verifique se o horário está disponível.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const timeOptions = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];
  
  const selectedRoom = rooms.find(room => room.id === formData.roomId);
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold mb-6">Nova Reserva</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Room Selection */}
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium mb-1">
                  Sala
                </label>
                <div className="relative">
                  <select
                    id="roomId"
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    className="w-full bg-white border rounded-md py-2 pl-3 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    disabled={loading}
                    required
                  >
                    <option value="" disabled>
                      Selecione uma sala
                    </option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id} disabled={!room.available}>
                        {room.name} ({room.block}) {!room.available && '- Ocupada'}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    {loading ? (
                      <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                    ) : (
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {selectedRoom && (
                  <div className="mt-2 p-3 bg-secondary/50 rounded-md text-sm">
                    <p><strong>Capacidade:</strong> {selectedRoom.capacity} pessoas</p>
                    <p><strong>Recursos:</strong> {selectedRoom.resources.map(r => r.name).join(', ')}</p>
                  </div>
                )}
              </div>
              
              {/* Date Selection */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Data
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full pl-10 py-2 pr-4 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    required
                  />
                </div>
              </div>
              
              {/* Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium mb-1">
                    Hora de Início
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <select
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full pl-10 py-2 pr-4 border rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                      required
                    >
                      {timeOptions.slice(0, -1).map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                    Hora de Término
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <select
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full pl-10 py-2 pr-4 border rounded-md text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                      required
                    >
                      {timeOptions.slice(1).map((time) => (
                        <option key={time} value={time} disabled={time <= formData.startTime}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Purpose */}
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium mb-1">
                  Finalidade da Reserva
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  rows={3}
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Descreva o propósito da reserva..."
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                className="px-4 py-2 rounded-md border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                onClick={() => navigate('/reservations')}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={cn(
                  "px-6 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2",
                  submitting && "opacity-80 pointer-events-none"
                )}
                disabled={submitting}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Reservando...' : 'Reservar Sala'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;

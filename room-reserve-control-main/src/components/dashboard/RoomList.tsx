
import React, { useState, useEffect } from 'react';
import { Room, RoomFilters } from '@/types';
import RoomCard from './RoomCard';
import apiClient from '@/services/api';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoomList: React.FC<{ filters: RoomFilters }> = ({ filters }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const roomsData = await apiClient.getRooms(filters);
        setRooms(roomsData);
      } catch (err) {
        setError('Não foi possível carregar as salas. Tente novamente mais tarde.');
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, [filters]);
  
  const handleRoomClick = (room: Room) => {
    navigate(`/reservations/new?roomId=${room.id}`);
  };
  
  if (loading && !rooms.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Carregando salas...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-lg p-4 text-center">
        <p>{error}</p>
      </div>
    );
  }
  
  if (!loading && !rooms.length) {
    return (
      <div className="bg-secondary rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhuma sala encontrada</h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros para encontrar salas disponíveis.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onClick={handleRoomClick}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default RoomList;

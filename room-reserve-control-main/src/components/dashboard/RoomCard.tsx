
import React from 'react';
import { Room } from '@/types';
import { Clock, Loader2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
  onClick: (room: Room) => void;
  loading?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick, loading = false }) => {
  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden border bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1 cursor-pointer",
        loading && "pointer-events-none opacity-50"
      )}
      onClick={() => onClick(room)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      
      <div className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">{room.name}</h3>
            <p className="text-sm text-muted-foreground">{room.block}</p>
          </div>
          
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
            room.available 
              ? "bg-green-50 text-green-600" 
              : "bg-red-50 text-red-600"
          )}>
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <div className={cn(
                "w-2 h-2 rounded-full",
                room.available ? "bg-green-500" : "bg-red-500"
              )} />
            )}
            <span>{room.available ? "Disponível" : "Ocupada"}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Capacidade: <strong>{room.capacity}</strong> pessoas</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {room.resources.map((resource) => (
              <span 
                key={resource.id}
                className="text-xs rounded-full px-2 py-0.5 bg-secondary text-secondary-foreground"
              >
                {resource.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

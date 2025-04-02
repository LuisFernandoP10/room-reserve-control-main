
import { Block, Reservation, ReservationFormData, Resource, Room, RoomFilters, BlockStatistic, RoomStatistic, TimeSlotStatistic } from "../types";

// Base URL para a API - substitua pela URL real da sua API quando disponível
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Dados mockados para desenvolvimento - serão usados como fallback se a API estiver indisponível
const mockBlocks: Block[] = [
  { id: "1", name: "Bloco A" },
  { id: "2", name: "Bloco B" },
  { id: "3", name: "Bloco C" },
  { id: "4", name: "Bloco D" },
];

const mockResources: Resource[] = [
  { id: "1", name: "Projetor" },
  { id: "2", name: "Computadores" },
  { id: "3", name: "Quadro Interativo" },
  { id: "4", name: "Sistema de Áudio" },
  { id: "5", name: "Ar Condicionado" },
];

const mockRooms: Room[] = [
  { id: "1", name: "Sala 101", block: "Bloco A", capacity: 40, resources: [mockResources[0], mockResources[4]], available: true },
  { id: "2", name: "Sala 102", block: "Bloco A", capacity: 30, resources: [mockResources[0], mockResources[3], mockResources[4]], available: false },
  { id: "3", name: "Sala 201", block: "Bloco B", capacity: 50, resources: [mockResources[0], mockResources[2], mockResources[4]], available: true },
  { id: "4", name: "Sala 202", block: "Bloco B", capacity: 25, resources: [mockResources[0], mockResources[4]], available: true },
  { id: "5", name: "Laboratório 1", block: "Bloco C", capacity: 35, resources: [mockResources[0], mockResources[1], mockResources[4]], available: true },
  { id: "6", name: "Laboratório 2", block: "Bloco C", capacity: 35, resources: [mockResources[0], mockResources[1], mockResources[4]], available: false },
  { id: "7", name: "Auditório", block: "Bloco D", capacity: 120, resources: [mockResources[0], mockResources[3], mockResources[4]], available: true },
  { id: "8", name: "Sala de Reuniões", block: "Bloco D", capacity: 15, resources: [mockResources[0], mockResources[3], mockResources[4]], available: true },
];

const mockReservations: Reservation[] = [
  { 
    id: "1", 
    roomId: "1", 
    roomName: "Sala 101", 
    blockName: "Bloco A", 
    date: "2023-11-15", 
    startTime: "08:00", 
    endTime: "10:00", 
    purpose: "Aula de Programação", 
    createdBy: "Prof. Silva" 
  },
  { 
    id: "2", 
    roomId: "3", 
    roomName: "Sala 201", 
    blockName: "Bloco B", 
    date: "2023-11-16", 
    startTime: "14:00", 
    endTime: "16:00", 
    purpose: "Reunião de Colegiado", 
    createdBy: "Prof. Silva" 
  },
  { 
    id: "3", 
    roomId: "5", 
    roomName: "Laboratório 1", 
    blockName: "Bloco C", 
    date: "2023-11-17", 
    startTime: "10:00", 
    endTime: "12:00", 
    purpose: "Aula Prática", 
    createdBy: "Prof. Silva" 
  },
];

const mockRoomStats: RoomStatistic[] = [
  { roomId: "1", roomName: "Sala 101", usageCount: 42, totalHours: 84 },
  { roomId: "3", roomName: "Sala 201", usageCount: 38, totalHours: 76 },
  { roomId: "5", roomName: "Laboratório 1", usageCount: 56, totalHours: 112 },
  { roomId: "7", roomName: "Auditório", usageCount: 24, totalHours: 72 },
];

const mockTimeSlotStats: TimeSlotStatistic[] = [
  { timeSlot: "08:00 - 10:00", count: 68 },
  { timeSlot: "10:00 - 12:00", count: 75 },
  { timeSlot: "14:00 - 16:00", count: 45 },
  { timeSlot: "16:00 - 18:00", count: 32 },
  { timeSlot: "19:00 - 21:00", count: 54 },
];

const mockBlockStats: BlockStatistic[] = [
  { blockName: "Bloco A", usageCount: 85, percentage: 35 },
  { blockName: "Bloco B", usageCount: 72, percentage: 30 },
  { blockName: "Bloco C", usageCount: 56, percentage: 22 },
  { blockName: "Bloco D", usageCount: 32, percentage: 13 },
];

// Cliente de API com chamadas reais e fallback para dados mockados
const apiClient = {
  // Função auxiliar para fazer requisições com tratamento de erro
  async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao acessar ${endpoint}:`, error);
      throw error;
    }
  },

  // Blocos
  getBlocks: async (): Promise<Block[]> => {
    try {
      // Tenta fazer a chamada real para a API
      return await apiClient.fetchAPI<Block[]>('blocks');
    } catch (error) {
      console.warn("Fallback para dados mockados de blocos:", error);
      // Usa dados mockados como fallback
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockBlocks), 300);
      });
    }
  },
  
  // Recursos
  getResources: async (): Promise<Resource[]> => {
    try {
      return await apiClient.fetchAPI<Resource[]>('resources');
    } catch (error) {
      console.warn("Fallback para dados mockados de recursos:", error);
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockResources), 300);
      });
    }
  },
  
  // Salas
  getRooms: async (filters: RoomFilters = {}): Promise<Room[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.block) queryParams.append('block', filters.block);
      if (filters.capacity) queryParams.append('capacity', filters.capacity.toString());
      if (filters.resources?.length) filters.resources.forEach(r => queryParams.append('resources', r));
      if (filters.query) queryParams.append('query', filters.query);
      if (filters.available !== undefined) queryParams.append('available', filters.available.toString());
      
      const queryString = queryParams.toString();
      const endpoint = `rooms${queryString ? `?${queryString}` : ''}`;
      
      return await apiClient.fetchAPI<Room[]>(endpoint);
    } catch (error) {
      console.warn("Fallback para dados mockados de salas:", error);
      // Usa a lógica existente como fallback
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredRooms = [...mockRooms];
          
          if (filters.block) {
            filteredRooms = filteredRooms.filter(room => room.block === filters.block);
          }
          
          if (filters.capacity) {
            filteredRooms = filteredRooms.filter(room => room.capacity >= (filters.capacity || 0));
          }
          
          if (filters.resources?.length) {
            filteredRooms = filteredRooms.filter(room => 
              filters.resources?.every(resourceId => 
                room.resources.some(r => r.id === resourceId)
              )
            );
          }
          
          if (filters.query) {
            const query = filters.query.toLowerCase();
            filteredRooms = filteredRooms.filter(room => 
              room.name.toLowerCase().includes(query) || 
              room.block.toLowerCase().includes(query)
            );
          }
          
          if (filters.available !== undefined) {
            filteredRooms = filteredRooms.filter(room => room.available === filters.available);
          }
          
          resolve(filteredRooms);
        }, 500);
      });
    }
  },
  
  // Reservas
  getReservations: async (): Promise<Reservation[]> => {
    try {
      return await apiClient.fetchAPI<Reservation[]>('reservations');
    } catch (error) {
      console.warn("Fallback para dados mockados de reservas:", error);
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockReservations), 300);
      });
    }
  },
  
  createReservation: async (data: ReservationFormData): Promise<Reservation> => {
    try {
      return await apiClient.fetchAPI<Reservation>('reservations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.warn("Fallback para criação simulada de reservas:", error);
      return new Promise((resolve) => {
        setTimeout(() => {
          const room = mockRooms.find(r => r.id === data.roomId);
          if (!room) throw new Error('Sala não encontrada');
          
          const newReservation: Reservation = {
            id: String(mockReservations.length + 1),
            roomId: data.roomId,
            roomName: room.name,
            blockName: room.block,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            purpose: data.purpose,
            createdBy: "Prof. Silva" // Isso viria do usuário autenticado
          };
          
          mockReservations.push(newReservation);
          resolve(newReservation);
        }, 800);
      });
    }
  },
  
  deleteReservation: async (id: string): Promise<void> => {
    try {
      await apiClient.fetchAPI<void>(`reservations/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn("Fallback para exclusão simulada de reservas:", error);
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockReservations.findIndex(r => r.id === id);
          if (index !== -1) {
            mockReservations.splice(index, 1);
          }
          resolve();
        }, 500);
      });
    }
  },
  
  // Estatísticas
  getRoomStatistics: async (): Promise<RoomStatistic[]> => {
    try {
      return await apiClient.fetchAPI<RoomStatistic[]>('statistics/rooms');
    } catch (error) {
      console.warn("Fallback para dados mockados de estatísticas de salas:", error);
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockRoomStats), 500);
      });
    }
  },
  
  getTimeSlotStatistics: async (): Promise<TimeSlotStatistic[]> => {
    try {
      return await apiClient.fetchAPI<TimeSlotStatistic[]>('statistics/timeslots');
    } catch (error) {
      console.warn("Fallback para dados mockados de estatísticas de horários:", error);
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockTimeSlotStats), 500);
      });
    }
  },
  
  getBlockStatistics: async (): Promise<BlockStatistic[]> => {
    try {
      return await apiClient.fetchAPI<BlockStatistic[]>('statistics/blocks');
    } catch (error) {
      console.warn("Fallback para dados mockados de estatísticas de blocos:", error);
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockBlockStats), 500);
      });
    }
  }
};

export default apiClient;

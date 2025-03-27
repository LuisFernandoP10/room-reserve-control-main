
import { Block, Reservation, ReservationFormData, Resource, Room, RoomFilters, BlockStatistic, RoomStatistic, TimeSlotStatistic } from "../types";

// Base URL for the API - would be replaced with actual API URL
const API_BASE_URL = "https://api.unievangelica.edu/rooms";

// Mock data for development - this would be replaced with actual API calls
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

// API client functions with error handling
const apiClient = {
  // Blocks
  getBlocks: async (): Promise<Block[]> => {
    try {
      // This would be replaced with an actual API call
      // const response = await fetch(`${API_BASE_URL}/blocks`);
      // if (!response.ok) throw new Error('Failed to fetch blocks');
      // return await response.json();
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockBlocks), 300);
      });
    } catch (error) {
      console.error("Error fetching blocks:", error);
      throw error;
    }
  },
  
  // Resources
  getResources: async (): Promise<Resource[]> => {
    try {
      // const response = await fetch(`${API_BASE_URL}/resources`);
      // if (!response.ok) throw new Error('Failed to fetch resources');
      // return await response.json();
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockResources), 300);
      });
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  },
  
  // Rooms
  getRooms: async (filters: RoomFilters = {}): Promise<Room[]> => {
    try {
      // const queryParams = new URLSearchParams();
      // if (filters.block) queryParams.append('block', filters.block);
      // if (filters.capacity) queryParams.append('capacity', filters.capacity.toString());
      // if (filters.resources?.length) filters.resources.forEach(r => queryParams.append('resources', r));
      // if (filters.query) queryParams.append('query', filters.query);
      // if (filters.available !== undefined) queryParams.append('available', filters.available.toString());
      
      // const response = await fetch(`${API_BASE_URL}/rooms?${queryParams}`);
      // if (!response.ok) throw new Error('Failed to fetch rooms');
      // return await response.json();
      
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
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },
  
  // Reservations
  getReservations: async (): Promise<Reservation[]> => {
    try {
      // const response = await fetch(`${API_BASE_URL}/reservations`);
      // if (!response.ok) throw new Error('Failed to fetch reservations');
      // return await response.json();
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockReservations), 300);
      });
    } catch (error) {
      console.error("Error fetching reservations:", error);
      throw error;
    }
  },
  
  createReservation: async (data: ReservationFormData): Promise<Reservation> => {
    try {
      // const response = await fetch(`${API_BASE_URL}/reservations`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      
      // if (!response.ok) throw new Error('Failed to create reservation');
      // return await response.json();
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const room = mockRooms.find(r => r.id === data.roomId);
          if (!room) throw new Error('Room not found');
          
          const newReservation: Reservation = {
            id: String(mockReservations.length + 1),
            roomId: data.roomId,
            roomName: room.name,
            blockName: room.block,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            purpose: data.purpose,
            createdBy: "Prof. Silva" // This would come from the authenticated user
          };
          
          mockReservations.push(newReservation);
          resolve(newReservation);
        }, 800);
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  },
  
  deleteReservation: async (id: string): Promise<void> => {
    try {
      // const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) throw new Error('Failed to delete reservation');
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockReservations.findIndex(r => r.id === id);
          if (index !== -1) {
            mockReservations.splice(index, 1);
          }
          resolve();
        }, 500);
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      throw error;
    }
  },
  
  // Statistics
  getRoomStatistics: async (): Promise<RoomStatistic[]> => {
    try {
      // const response = await fetch(`${API_BASE_URL}/statistics/rooms`);
      // if (!response.ok) throw new Error('Failed to fetch room statistics');
      // return await response.json();
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockRoomStats), 500);
      });
    } catch (error) {
      console.error("Error fetching room statistics:", error);
      throw error;
    }
  },
  
  getTimeSlotStatistics: async (): Promise<TimeSlotStatistic[]> => {
    try {
      // const response = await fetch(`${API_BASE_URL}/statistics/timeslots`);
      // if (!response.ok) throw new Error('Failed to fetch time slot statistics');
      // return await response.json();
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockTimeSlotStats), 500);
      });
    } catch (error) {
      console.error("Error fetching time slot statistics:", error);
      throw error;
    }
  },
  
  getBlockStatistics: async (): Promise<BlockStatistic[]> => {
    try {
      // const response = await fetch(`${API_BASE_URL}/statistics/blocks`);
      // if (!response.ok) throw new Error('Failed to fetch block statistics');
      // return await response.json();
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockBlockStats), 500);
      });
    } catch (error) {
      console.error("Error fetching block statistics:", error);
      throw error;
    }
  }
};

export default apiClient;

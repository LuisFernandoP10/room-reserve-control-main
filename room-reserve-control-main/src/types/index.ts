
// Room types
export interface Room {
  id: string;
  name: string;
  block: string;
  capacity: number;
  resources: Resource[];
  available: boolean;
}

export interface Block {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  name: string;
}

// Reservation types
export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  blockName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  createdBy: string;
}

export interface ReservationFormData {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

// Filter types
export interface RoomFilters {
  block?: string;
  capacity?: number;
  resources?: string[];
  query?: string;
  available?: boolean;
}

// Statistics types
export interface RoomStatistic {
  roomId: string;
  roomName: string;
  usageCount: number;
  totalHours: number;
}

export interface TimeSlotStatistic {
  timeSlot: string;
  count: number;
}

export interface BlockStatistic {
  blockName: string;
  usageCount: number;
  percentage: number;
}

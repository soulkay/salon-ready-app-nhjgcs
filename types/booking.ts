
export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface Booking {
  id: string;
  service: Service;
  date: string;
  time: string;
  queueNumber: number;
  status: 'waiting' | 'ready' | 'completed';
  estimatedWaitTime: number;
}

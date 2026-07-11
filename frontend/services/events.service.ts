import { axiosInstance } from '@/lib/axios';
import type {
  CreateEventInput,
  Event,
  EventsQueryParams,
  PaginatedResponse,
} from '@/types';

export const eventsService = {
  /**
   * Get all events with optional search/filter/sort/pagination.
   */
  getAll: async (params?: EventsQueryParams): Promise<PaginatedResponse<Event>> => {
    const res = await axiosInstance.get<PaginatedResponse<Event>>('/events', {
      params,
    });
    return res.data;
  },

  /**
   * Get a single event by ID.
   */
  getById: async (id: string): Promise<Event> => {
    const res = await axiosInstance.get<Event>(`/events/${id}`);
    return res.data;
  },

  /**
   * Create a new event. Sends multipart/form-data if banner image is included.
   */
  create: async (data: CreateEventInput): Promise<Event> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('eventType', data.eventType);
    formData.append('description', data.description);
    formData.append('registrationDeadline', data.registrationDeadline);
    formData.append('eventDate', data.eventDate);
    if (data.registrationLink) {
      formData.append('registrationLink', data.registrationLink);
    }
    if (data.bannerImage) {
      formData.append('bannerImage', data.bannerImage);
    }

    const res = await axiosInstance.post<Event>('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  /**
   * Update an existing event.
   */
  update: async (id: string, data: Partial<CreateEventInput>): Promise<Event> => {
    const res = await axiosInstance.patch<Event>(`/events/${id}`, data);
    return res.data;
  },

  /**
   * Delete an event.
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/events/${id}`);
  },
};

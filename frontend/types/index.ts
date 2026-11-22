// ─── Enums / Union Types ───────────────────────────────────────────────────

export type EventCategory =
  | 'hackathon'
  | 'workshop'
  | 'seminar'
  | 'competition'
  | 'cultural'
  | 'sports'
  | 'other';

export type EventType = 'online' | 'offline' | 'hybrid';

export type JoinRequestStatus = 'pending' | 'accepted' | 'rejected';

export type NotificationType =
  | 'request_received'
  | 'request_accepted'
  | 'request_rejected'
  | 'member_joined';

// ─── User ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  avatarUrl?: string;
  createdAt: string;
}

// ─── Event ─────────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  eventType: EventType;
  description: string;
  registrationDeadline: string; // ISO date string
  eventDate: string;            // ISO date string
  registrationLink?: string;
  bannerImage?: string | null;
  interestedCount?: number;
  teamCount?: number;
  _count?: {
    interests: number;
    teams: number;
  };
  createdAt: string;
  createdBy: User;
  isInterested?: boolean | null; // resolved for current user on backend
  teams?: Team[];
}

export interface CreateEventInput {
  title: string;
  category: EventCategory;
  eventType: EventType;
  description: string;
  registrationDeadline: string;
  eventDate: string;
  registrationLink?: string;
  bannerImage?: File;
}

// ─── Interested ────────────────────────────────────────────────────────────

export interface InterestedEntry {
  id: string;
  eventId: string;
  userId: string;
  user: Pick<User, 'id' | 'name' | 'department'>;
  interestText: string;
  createdAt: string;
}

export interface MarkInterestedInput {
  interestText: string;
}

// ─── Team ──────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  department: string;
  joinedAt: string;
  isLeader: boolean;
}

export interface Team {
  id: string;
  eventId: string;
  name: string;
  maxMembers: number;
  currentMembers: number;
  lookingFor: string;
  description: string;
  leaderId: string;
  leaderName: string;
  whatsapp?: string;
  facebook?: string;
  discord?: string;
  members: TeamMember[];
  createdAt: string;
  isCurrentUserMember?: boolean;
  isCurrentUserLeader?: boolean;
}

export interface CreateTeamInput {
  name: string;
  maxMembers: number;
  lookingFor: string;
  description: string;
  whatsapp: string;
  facebook: string;
  discord?: string;
}

// ─── Join Request ──────────────────────────────────────────────────────────

export interface JoinRequest {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  department: string;
  introduction: string;
  status: JoinRequestStatus;
  createdAt: string;
}

export interface CreateJoinRequestInput {
  introduction: string;
}

// ─── Notification ──────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  department: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── API Wrappers ──────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ─── Query Params ──────────────────────────────────────────────────────────

export interface EventsQueryParams {
  search?: string;
  category?: EventCategory;
  sortBy?: 'deadline' | 'eventDate' | 'createdAt';
  page?: number;
  limit?: number;
}

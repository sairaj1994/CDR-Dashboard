
// Call Detail Record type
export interface CDR {
  call_id: string;
  from_user: string;
  to_user: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  hangup_by: string;
  room: string;
  recording_url?: string;
}

// User type
export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Login credentials
export interface LoginCredentials {
  username: string;
  password: string;
}

// Search params for CDR
export interface CDRSearchParams {
  query?: string;
  from_date?: string;
  to_date?: string;
  from_user?: string;
  to_user?: string;
  min_duration?: number;
  max_duration?: number;
  hangup_by?: string;
  room?: string;
}

// CDR Analytics Summary
export interface CDRSummary {
  total_calls: number;
  total_duration: number;
  avg_duration: number;
  calls_by_day: {
    date: string;
    count: number;
  }[];
  top_users: {
    username: string;
    call_count: number;
  }[];
  call_duration_distribution: {
    range: string;
    count: number;
  }[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
  votes: string[];
  createdAt: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  category: 'Infrastructure' | 'Safety' | 'Environment' | 'Public Services' | 'Other';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  imageUrl?: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  votes: number;
  votedBy: string[];
  createdBy: string | User;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
import { User } from 'firebase/auth';

export interface AuthState {
  currentUser: User | null;
  jwtToken: string | null;
}

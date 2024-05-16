import { CustomUser } from "./user";

export interface AuthState {
  currentUser: CustomUser | null;
  jwtToken: string | null;
}

import { User as FirebaseUser } from "firebase/auth";

export interface CustomUser extends FirebaseUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  avatar_url?: string;
}
import { User as FirebaseUser } from "firebase/auth";

export interface CustomUser extends FirebaseUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  token: string;
}

import { User as FirebaseUser } from "firebase/auth";

export interface CustomUser extends FirebaseUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatar_url?: string;  // ここに追加
  token?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
}

export type UserRole = "admin" | "writer" | "viewer";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "writer" | "viewer";
  createdAt: string;
}

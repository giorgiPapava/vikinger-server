export interface User {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  username?: any;
  password?: any;
  googleId: string;
}

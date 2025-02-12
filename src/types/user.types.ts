export interface TUser {
  name: string;
  _id: string;
  email: string;
  password: string;
  contract: number;
  role: "admin" | "user";
  isVerified: boolean;
  profileImage: string;
  bio: string;
  isBanned: boolean;
  isDeleted: boolean;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

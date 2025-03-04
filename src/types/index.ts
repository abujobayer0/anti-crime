export interface User {
  _id: string;
  name: string;
  email: string;
  isBanned: boolean;
  isVerified: boolean;
  role: "admin" | "user";
  profileImage: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  __v: number;
}

export interface Report {
  _id: string;
  title: string;
  description: string;
  location: string;
  type?: "report" | "user";
  district: string;
  division: string;
  images: string[];
  video?: string;
  crimeTime: string;
  postTime: string;
  upvotes: string[];
  downvotes: string[];
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  userId: {
    _id: string;
    name: string;
  };
  isDeleted?: boolean;
}

export interface Comment {
  _id: string;
  text: string;
  reportId: string;
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  isBanned: boolean;
  isDeleted: boolean;
  password?: string;
  contact?: string;
  profileImage: string;
  isVerified: boolean;
}

export interface Comment {
  _id: string;
  comment: string;
  createdAt: string;
  isDeleted: boolean;
  proofImage: string[];
  proofVideo: string[];
  replyTo: Comment[];
  reportId: string;
  updatedAt: string;
  userId: User;
}

export interface CrimeReport {
  _id: string;
  createdAt: string;
  crimeTime: string;
  description: string;
  district: string;
  districtCoordinates: string[];
  division: string;
  divisionCoordinates: string[];
  downvotes: User[];
  images: string[];
  isDeleted: boolean;
  postTime: string;
  title: string;
  updatedAt: string;
  upvotes: User[];
  userId: User;
  comments: Comment[];
  __v?: number;
}

export interface Props {
  report: CrimeReport;
  deleteReport: any;
  updateReport: any;
  voteReport: any;
  user: {
    user: User;
  };
}

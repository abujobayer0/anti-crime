import { User as GlobalUser } from "@/types";

export type User = GlobalUser;

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
  userId: GlobalUser;
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
  algorithmScore?: number;
  crimeType?: string;
}

export interface Props {
  report: CrimeReport;
  deleteReport: (id: string) => void;
  updateReport: (data: { id: string; data: any }) => void;
  voteReport: (data: { id: string; type: "upvote" | "downvote" }) => void;
  user: GlobalUser;
}

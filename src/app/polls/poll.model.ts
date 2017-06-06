/**
 * 
 */
interface Option {
  _id: string;
  label: string;
  votes: number;
}

/**
 * 
 */
export interface Poll {
  _id: string;
  title: string;
  postedBy: { _id: string, username: string };
  createdAt: string;
  options: Option[];
  participants: String[];
}

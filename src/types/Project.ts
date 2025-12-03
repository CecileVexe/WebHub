export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[];
  color: "purple" | "pink" | "orange";
}

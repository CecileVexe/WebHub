export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

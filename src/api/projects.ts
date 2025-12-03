export type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[];
  color: "purple" | "pink" | "orange";
};

export type CreateProjectInput = Omit<Project, "id">;
export type UpdateProjectPatch = Partial<Omit<Project, "id">>;

const BASE_URL = "http://localhost:3001/projects";


async function assertOk(res: Response, context: string) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${context} (${res.status}) ${text}`);
  }
}

export async function listProjects(): Promise<Project[]> {
  const res = await fetch(BASE_URL);
  await assertOk(res, "Erreur listProjects");
  return res.json() as Promise<Project[]>;
}

export async function createProject(project: CreateProjectInput): Promise<Project> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  await assertOk(res, "Erreur createProject");
  return res.json() as Promise<Project>;
}

export async function updateProject(id: number, patch: UpdateProjectPatch): Promise<Project> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  await assertOk(res, "Erreur updateProject");
  return res.json() as Promise<Project>;
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  await assertOk(res, "Erreur deleteProject");
}

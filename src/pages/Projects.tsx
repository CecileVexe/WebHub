import { useEffect, useState } from "react";
import type { Project } from "../api/projects";
import { createProject, deleteProject, listProjects, updateProject } from "../api/projects";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      setProjects(await listProjects());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;

    setError(null);
    try {
      await createProject({ title: t, description: description.trim() || undefined });
      setTitle("");
      setDescription("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  };

  const onEdit = async (p: Project) => {
    const newTitle = window.prompt("Nouveau titre :", p.title);
    if (newTitle === null) return;

    const t = newTitle.trim();
    if (!t) return;

    setError(null);
    try {
      await updateProject(p.id, { title: t });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  };

  const onDelete = async (id: number) => {
    if (!window.confirm("Supprimer ce projet ?")) return;

    setError(null);
    try {
      await deleteProject(id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1>Projets</h1>

      <form onSubmit={onCreate} style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Ajouter</button>
      </form>

      {error && (
        <p style={{ background: "#ffe5e5", padding: 10, borderRadius: 8 }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <ul style={{ display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
          {projects.map((p) => (
            <li key={p.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
              <b>{p.title}</b>
              {p.description && <div>{p.description}</div>}

              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button type="button" onClick={() => onEdit(p)}>
                  Modifier
                </button>
                <button type="button" onClick={() => onDelete(p.id)}>
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

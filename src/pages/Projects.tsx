import { useEffect, useMemo, useState } from "react";
import type { Project } from "../api/projects";
import { createProject, deleteProject, listProjects, updateProject } from "../api/projects";
import { Pencil, Trash2, Plus } from "lucide-react";

type ProjectColor = "purple" | "pink" | "orange";

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function tagsToInput(tags: string[]): string {
  return tags.join(", ");
}

const colorUI: Record<
  ProjectColor,
  {
    badge: string;
    chip: string;
    button: string;
    buttonSoft: string;
    ring: string;
    dot: string;
  }
> = {
  purple: {
    badge: "bg-purple-600 text-white",
    chip: "bg-purple-50 text-purple-700 ring-purple-200",
    button: "from-purple-600 via-purple-600 to-purple-500",
    buttonSoft: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    ring: "ring-purple-200",
    dot: "bg-purple-500",
  },
  pink: {
    badge: "bg-pink-600 text-white",
    chip: "bg-pink-50 text-pink-700 ring-pink-200",
    button: "from-pink-600 via-pink-600 to-pink-500",
    buttonSoft: "bg-pink-100 text-pink-700 hover:bg-pink-200",
    ring: "ring-pink-200",
    dot: "bg-pink-500",
  },
  orange: {
    badge: "bg-orange-600 text-white",
    chip: "bg-orange-50 text-orange-700 ring-orange-200",
    button: "from-orange-600 via-orange-600 to-orange-500",
    buttonSoft: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    ring: "ring-orange-200",
    dot: "bg-orange-500",
  },
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [color, setColor] = useState<ProjectColor>("purple");

  const total = projects.length;

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

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setImageUrl("");
    setTagsInput("");
    setColor("purple");
  };

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: Omit<Project, "id"> = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      imageUrl: imageUrl.trim(),
      tags: parseTags(tagsInput),
      color,
    };

    if (!payload.title) return;

    setError(null);
    try {
      await createProject(payload);
      resetForm();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce projet ?")) return;

    setError(null);
    try {
      await deleteProject(id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  };

  const onEdit = async (p: Project) => {
    const newTitle = window.prompt("Titre :", p.title);
    if (newTitle === null) return;

    const newDescription = window.prompt("Description :", p.description);
    if (newDescription === null) return;

    const newCategory = window.prompt("Catégorie :", p.category);
    if (newCategory === null) return;

    const newImageUrl = window.prompt("Image URL :", p.imageUrl);
    if (newImageUrl === null) return;

    const newTags = window.prompt("Tags (séparés par des virgules) :", tagsToInput(p.tags));
    if (newTags === null) return;

    const newColor = window.prompt('Color ("purple" | "pink" | "orange") :', p.color);
    if (newColor === null) return;

    const colorValue = (["purple", "pink", "orange"] as const).includes(newColor as ProjectColor)
      ? (newColor as ProjectColor)
      : p.color;

    setError(null);
    try {
      await updateProject(p.id, {
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory.trim(),
        imageUrl: newImageUrl.trim(),
        tags: parseTags(newTags),
        color: colorValue,
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  };

  const categoriesCount = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return set.size;
  }, [projects]);

  const tagsCount = useMemo(() => {
    const set = new Set(projects.flatMap((p) => p.tags ?? []));
    return set.size;
  }, [projects]);

  return (
    <div className="min-h-screen bg-grey-600 from-purple-50 via-pink-50 to-orange-50">
      {/* background blobs (optionnel mais proche de ta home) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Gestion des projets
            </h1>
            <p className="text-grey">
              CRUD simple avec JSON Server — style “cards” comme ta home.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-2xl bg-white/70 backdrop-blur border border-purple-100/60 shadow-sm text-gray-700">
              <span className="font-semibold">{total}</span> projet(s)
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-3xl p-7 text-white shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="text-white/90 mb-2">Total Projects</div>
            <div className="text-2xl font-semibold">{total} Active</div>
          </div>

          <div className="rounded-3xl p-7 text-white shadow-xl bg-gradient-to-br from-pink-500 to-pink-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="text-white/90 mb-2">Categories</div>
            <div className="text-2xl font-semibold">{categoriesCount} type(s)</div>
          </div>

          <div className="rounded-3xl p-7 text-white shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="text-white/90 mb-2">Technologies</div>
            <div className="text-2xl font-semibold">{tagsCount}+ tags</div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur rounded-3xl border border-purple-100/60 shadow-xl p-6 md:p-8 mb-10">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Ajouter un projet</h2>

            <button
              type="submit"
              form="create-project"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium shadow-lg transition-opacity hover:opacity-95 bg-gradient-to-r ${colorUI[color].button}`}
            >
              <Plus className="w-5 h-5" />
              Ajouter
            </button>
          </div>

          <form
            id="create-project"
            onSubmit={onCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre"
              className="w-full rounded-2xl border-2 border-purple-100 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-transparent transition"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Catégorie"
              className="w-full rounded-2xl border-2 border-purple-100 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-transparent transition"
            />

            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full rounded-2xl border-2 border-purple-100 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-transparent transition md:col-span-2"
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full rounded-2xl border-2 border-purple-100 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-transparent transition md:col-span-2"
            />

            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tags (ex: react, vite, api)"
              className="w-full rounded-2xl border-2 border-purple-100 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-transparent transition"
            />

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">Couleur</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value as ProjectColor)}
                className="w-full rounded-2xl border-2 border-purple-100 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-transparent transition"
              >
                <option value="purple">purple</option>
                <option value="pink">pink</option>
                <option value="orange">orange</option>
              </select>
            </div>
          </form>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
              {error}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Featured Projects</h2>
        </div>

        {loading ? (
          <div className="text-gray-600">Chargement…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => {
              const ui = colorUI[p.color];
              return (
                <article
                  key={p.id}
                  className="group bg-white/80 backdrop-blur rounded-3xl border border-purple-100/60 shadow-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-2xl transition"
                >
                  {/* Image */}
                  <div className="relative h-44">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/0 to-black/40 z-10" />
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}

                    {/* Badge category */}
                    <div className="absolute z-20 top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ui.badge}`}>
                        {p.category || "Uncategorized"}
                      </span>
                    </div>

                    {/* Dot color */}
                    <div className="absolute z-20 top-4 right-4">
                      <div
                        title={p.color}
                        className={`w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center ring-1 ring-black/5`}
                      >
                        <span className={`w-3 h-3 rounded-full ${ui.dot}`} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-gray-900 font-semibold text-lg">{p.title}</h3>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-3">
                      {p.description}
                    </p>

                    {/* Tags */}
                    {p.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className={`px-3 py-1 rounded-full text-xs font-medium ring-1 ${ui.chip}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium shadow-sm transition ${ui.buttonSoft}`}
                      >
                        <Pencil className="w-4 h-4" />
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(p.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

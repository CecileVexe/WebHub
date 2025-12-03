import { Search, Sparkles, Layers, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listProjects, type Project } from "../api/projects";
import ProjectsPage from "./../pages/Projects";
import { ProjectCard } from "../components/projects/project-card";



type Page = "home" | "crud";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // ✅ Charge les projets depuis db.json (JSON Server)
  useEffect(() => {
    const load = async () => {
      setLoadingProjects(true);
      setProjectsError(null);
      try {
        const data = await listProjects();
        setProjects(data);
      } catch (e) {
        setProjectsError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setLoadingProjects(false);
      }
    };

    load();
  }, []);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((p) => {
      const inText =
        (p.title ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q);

      const inTags = Array.isArray(p.tags)
        ? p.tags.some((t) => (t ?? "").toLowerCase().includes(q))
        : false;

      return inText || inTags;
    });
  }, [searchQuery, projects]);

  // ✅ Si on est sur la page CRUD, on affiche ProjectsPage directement
  if (page === "crud") {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => setPage("home")}
            className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            ← Retour à l’accueil
          </button>
        </div>

        <ProjectsPage />
      </div>
    );
  }

  // ✅ Home
  return (
    <div className="min-h-screen bg-black">
  {/* Animated Background Blobs — purely decorative */}
  <div
    className="fixed inset-0 overflow-hidden pointer-events-none"
    aria-hidden="true"
  >
    <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob" />
    <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-2000" />
    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-blob animation-delay-4000" />
  </div>

  <div className="relative z-10">
    {/* HEADER */}
    <header
      className="backdrop-blur-sm bg-white/80 border-b border-purple-100/50 sticky top-0 z-50"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              className="w-12 h-12"
              alt="Creative Projects — Logo"
            />

            <div>
              <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent text-xl">
                Creative Projects
              </h1>
              <p className="text-gray-600 mt-1">
                Discover amazing web experiences
              </p>
            </div>
          </div>

          {/* Search + CRUD Button */}
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

            {/* SEARCH */}
            <div className="relative w-full md:w-auto">
              <label
                htmlFor="search-projects"
                className="sr-only"
              >
                Search projects
              </label>

              <input
                id="search-projects"
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-80 bg-white/90 backdrop-blur-sm transition-all"
              />

              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5"
                aria-hidden="true"
              />
            </div>

            {/* CRUD BUTTON */}
            <button
              onClick={() => setPage("crud")}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-medium shadow-lg hover:opacity-95 transition-opacity text-center"
              aria-label="Manage projects"
            >
              Gérer les projets (CRUD)
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* HERO SECTION */}
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      role="region"
      aria-labelledby="hero-title"
    >
      <div className="text-center mb-12">
        <h2
          id="hero-title"
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4 text-3xl"
        >
          Stunning Web Projects
        </h2>
        <p className="text-white max-w-2xl mx-auto">
          Explore our curated collection of innovative web applications and beautiful designs
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

        {/* CARD 1 */}
        <div
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group hover:scale-105 transition-transform"
          role="status"
          aria-label="Total projects"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
          <Layers className="w-10 h-10 mb-4 relative z-10" aria-hidden="true" />
          <div className="relative z-10">
            <p className="opacity-90 mb-2">Total Projects</p>
            <p>{filteredProjects.length} Active</p>
          </div>
        </div>

        {/* CARD 2 */}
        <div
          className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group hover:scale-105 transition-transform"
          role="status"
          aria-label="Categories"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
          <Sparkles className="w-10 h-10 mb-4 relative z-10" aria-hidden="true" />
          <div className="relative z-10">
            <p className="opacity-90 mb-2">Categories</p>
            <p>Depuis la DB</p>
          </div>
        </div>

        {/* CARD 3 */}
        <div
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group hover:scale-105 transition-transform"
          role="status"
          aria-label="Technologies"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
          <Zap className="w-10 h-10 mb-4 relative z-10" aria-hidden="true" />
          <div className="relative z-10">
            <p className="opacity-90 mb-2">Technologies</p>
            <p>Depuis la DB</p>
          </div>
        </div>
      </div>

      {/* API STATE */}
      {loadingProjects && (
        <div
          className="text-center text-gray-600 mb-10"
          role="status"
          aria-live="polite"
        >
          Chargement des projets…
        </div>
      )}

      {projectsError && (
        <div
          className="mb-10 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3"
          role="alert"
        >
          {projectsError}
          <div className="text-sm text-red-600 mt-1">
            Vérifie que <code className="px-1">npm run api</code> est lancé et que{" "}
            <code className="px-1">db.json</code> contient bien une clé <code className="px-1">"projects"</code>.
          </div>
        </div>
      )}

      {/* PROJECT GRID */}
      {!loadingProjects && !projectsError && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-white text-2xl">Featured Projects</h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            role="list"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} role="listitem" />
            ))}
          </div>
        </div>
      )}
    </section>
  </div>
</div>

  );
}

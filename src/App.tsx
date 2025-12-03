import { ProjectCard } from "./components/projects/project-card";
import { Search, Sparkles, Layers, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import ProjectsPage from "./pages/Projects"; // <-- ta page CRUD

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[];
  color: "purple" | "pink" | "orange";
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A modern online shopping experience with seamless checkout and product browsing.",
    category: "E-Commerce",
    imageUrl:
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
    tags: ["React", "TypeScript", "Tailwind"],
    color: "purple",
  },
  {
    id: 2,
    title: "Portfolio Website",
    description:
      "Clean and minimalist portfolio showcasing creative work and professional experience.",
    category: "Portfolio",
    imageUrl:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    tags: ["Next.js", "Design", "Animation"],
    color: "pink",
  },
  {
    id: 3,
    title:
      "Dashboard Analytics",
    description:
      "Data visualization dashboard with real-time metrics and interactive charts.",
    category: "Dashboard",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tags: ["React", "Charts", "Analytics"],
    color: "orange",
  },
  {
    id: 4,
    title: "Social Media App",
    description:
      "Connect with friends and share moments through an engaging social platform.",
    category: "Social",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    tags: ["Mobile", "Social", "React Native"],
    color: "pink",
  },
  {
    id: 5,
    title: "Blog Platform",
    description:
      "Content management system for writers with markdown support and SEO optimization.",
    category: "Content",
    imageUrl:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    tags: ["CMS", "SEO", "Publishing"],
    color: "purple",
  },
  {
    id: 6,
    title: "Booking System",
    description:
      "Streamlined reservation and scheduling system for service-based businesses.",
    category: "Business",
    imageUrl:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    tags: ["Booking", "Calendar", "Payments"],
    color: "orange",
  },
];

type Page = "home" | "crud";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const inText =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
      return inText || inTags;
    });
  }, [searchQuery]);

  // ✅ Si on est sur la page CRUD, on affiche ProjectsPage directement
  if (page === "crud") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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

  // ✅ Home (ton design)
  return (
    <div className="min-h-screen bg-blue-500 from-purple-50 via-pink-50 to-orange-50">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-sm bg-white/80 border-b border-purple-100/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Vite: si logo dans /public => /logo.png */}
                <img src="/logo.png" className="w-12 h-12" />
                <div>
                  <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                    Creative Projects
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Discover amazing web experiences
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 pr-4 py-3 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-80 bg-white/90 backdrop-blur-sm transition-all"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                </div>

                {/* ✅ BOUTON VERS LA PAGE CRUD */}
                <button
                  onClick={() => setPage("crud")}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-medium shadow-lg hover:opacity-95 transition-opacity text-center"
                >
                  Gérer les projets (CRUD)
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="bg-white bg-clip-text text-transparent mb-4">
              Stunning Web Projects
            </h2>
            <p className="text-white max-w-2xl mx-auto">
              Explore our curated collection of innovative web applications and beautiful designs
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <Layers className="w-10 h-10 mb-4 relative z-10" />
              <div className="relative z-10">
                <div className="opacity-90 mb-2">Total Projects</div>
                <div>{filteredProjects.length} Active</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <Sparkles className="w-10 h-10 mb-4 relative z-10" />
              <div className="relative z-10">
                <div className="opacity-90 mb-2">Categories</div>
                <div>6 Different Types</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group hover:scale-105 transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <Zap className="w-10 h-10 mb-4 relative z-10" />
              <div className="relative z-10">
                <div className="opacity-90 mb-2">Technologies</div>
                <div>15+ Stack Options</div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white">Featured Projects</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
                  All
                </button>
                <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  Popular
                </button>
                <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  Recent
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="backdrop-blur-sm bg-white/60 border-t border-purple-100/50 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg" />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Creative Projects
                </span>
              </div>
              <p className="text-gray-600">© 2025 Creative Projects. Crafted with passion.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

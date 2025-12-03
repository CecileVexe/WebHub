import { ExternalLink, Tag, Heart } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../global/ImageWithFallback";
import { NavLink } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  tags: string[];
  color: "purple" | "pink" | "orange";
}

interface ProjectCardProps {
  project: Project;
}

const colorClasses = {
  purple: {
    badge: "bg-gradient-to-r from-purple-500 to-purple-600",
    tag: "bg-purple-100 text-purple-700 border-purple-200",
    button: "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    overlay: "from-purple-600/90 to-purple-800/90",
  },
  pink: {
    badge: "bg-gradient-to-r from-pink-500 to-pink-600",
    tag: "bg-pink-100 text-pink-700 border-pink-200",
    button: "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
    overlay: "from-pink-600/90 to-pink-800/90",
  },
  orange: {
    badge: "bg-gradient-to-r from-orange-500 to-orange-600",
    tag: "bg-orange-100 text-orange-700 border-orange-200",
    button: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    overlay: "from-orange-600/90 to-orange-800/90",
  },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const colors = colorClasses[project.color];

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t ${colors.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
          <button className="px-6 py-3 bg-white text-gray-900 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 flex items-center gap-2 shadow-xl">
            <ExternalLink className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`${colors.badge} text-white px-4 py-2 rounded-full text-sm shadow-lg`}>
            {project.category}
          </span>
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked ? "fill-pink-500 text-pink-500" : "text-gray-600"
            } transition-colors`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-orange-600 group-hover:bg-clip-text transition-all">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-5 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag, index) => (
            <div
              key={index}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border ${colors.tag} transition-transform hover:scale-105`}
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <NavLink to={`/projects/${project.id}`} className={`w-full ${colors.button} text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}>
          <span>Explore Project</span>
          <ExternalLink className="w-4 h-4" />
        </NavLink>
      </div>
    </div>
  );
}

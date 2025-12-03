import React from 'react';
import JSZip from 'jszip';
import { Download } from 'lucide-react';

interface ExportFilesProps {
  htmlContent: string;
  cssContent: string;
}

export const ExportFiles: React.FC<ExportFilesProps> = ({ htmlContent, cssContent }) => {
  const handleExport = async () => {
    try {
      const zip = new JSZip();
      
      // Add files to the zip
      zip.file("index.html", htmlContent);
      zip.file("styles.css", cssContent);
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "web-project.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating zip file:", error);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      <Download className="w-4 h-4" />
      Export Project
    </button>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { importJson } from "./utils/importJson.ts";
import { exportToZip } from "./utils/generate.ts";

const MainComponent = () => {
  const [jsonData, setJsonData] = useState<any[]>([]);

  const handleImport = async () => {
    try {
      const data = await importJson();
      setJsonData(data);
      console.log("Données importées:", data);
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
    }
  };

  const handleExport = async () => {
    if (jsonData.length === 0) {
      alert("Aucune donnée à exporter. Veuillez d'abord importer un fichier JSON.");
      return;
    }

    try {
      await exportToZip(jsonData);
      console.log("Export réussi!");
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alert("Erreur lors de l'export du fichier ZIP.");
    }
  };

  return <>
    <div className="codeforge-page">
      <div className="codeforge-container">
        <h1>CodeForge</h1>
        <div className="codeforge-button-container">
        <button onClick={handleImport} className="codeforge-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="codeforge-svg" viewBox="0 0 24 24"><path fill="#fff" d="M21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1Zm-9.71 1.71a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l4-4a1 1 0 0 0-1.42-1.42L13 12.59V3a1 1 0 0 0-2 0v9.59l-2.29-2.3a1 1 0 1 0-1.42 1.42Z"/></svg>
          Importer un fichier JSON
        </button>
        <button
          onClick={handleExport}
          disabled={jsonData.length === 0}
          className={`codeforge-button ${jsonData.length === 0 ? "disabled" : ""}`}
          style={{
            opacity: jsonData.length === 0 ? 0.5 : 1,
            cursor: jsonData.length === 0 ? "not-allowed" : "pointer"
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="codeforge-svg" viewBox="0 0 24 24"><path fill="#fff" d="M8.71 7.71L11 5.41V15a1 1 0 0 0 2 0V5.41l2.29 2.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-4-4a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-4 4a1 1 0 1 0 1.42 1.42ZM21 14a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1Z"/></svg>
          Exporter en ZIP
        </button>
        </div>

      {jsonData.length > 0 && (
        <div style={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
          <p><strong>Données chargées:</strong> {jsonData.length} élément(s)</p>
        </div>
      )}
      </div>
    </div>
  </>;
};

export default MainComponent;

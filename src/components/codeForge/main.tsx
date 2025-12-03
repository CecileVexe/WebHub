import { useState } from "react";
import { importJson } from "./utils/importJson.ts";
import { exportToZip } from "./utils/generate.ts";

const main = () => {
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
      <h1>CodeForge</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px"}}>
        <button onClick={handleImport}>Importer un fichier JSON</button>
        <button
          onClick={handleExport}
          disabled={jsonData.length === 0}
          style={{
            opacity: jsonData.length === 0 ? 0.5 : 1,
            cursor: jsonData.length === 0 ? "not-allowed" : "pointer"
          }}
        >
          Exporter en ZIP
        </button>
      </div>
      {jsonData.length > 0 && (
        <div style={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
          <p><strong>Données chargées:</strong> {jsonData.length} élément(s)</p>
        </div>
      )}
    </div>

  </>;
};

export default main;

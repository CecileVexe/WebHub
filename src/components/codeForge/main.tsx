import {importJson} from "./utils/importJson.ts";

const main = () => {


  // generateAndDownloadZip(exemple);


  return <>
    <h1>CodeForge</h1>
    <button onClick={() => importJson()}>Importer un fichier JSON</button>
  </>;
};

export default main;

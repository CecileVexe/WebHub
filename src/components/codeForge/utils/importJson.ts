import {generateAndDownloadZip} from "./generate.ts";

export async function importJson(): Promise<any> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.display = 'none';

    const cleanup = () => {
      input.remove();
    };

    input.addEventListener('change', () => {
      const file: any = input.files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        cleanup();
        return;
      }
      generateAndDownloadZip(file)
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = typeof reader.result === 'string' ? reader.result : '';
          const parsed = JSON.parse(text);
          console.log(parsed);
          generateAndDownloadZip(parsed)
          resolve(parsed);

        } catch (err) {
          console.error('Invalid JSON', err);
          reject(err);
        } finally {
          cleanup();
        }
      };
      reader.onerror = (e) => {
        console.error('File read error', e);
        reject(e);
        cleanup();
      };
      reader.readAsText(file);
    }, { once: true });

    document.body.appendChild(input);
    input.click();
  });
}
const fs = require('fs');
const path = require('path');

const FILES_TO_SYNC = ['duas.json', 'hadiths.json', 'stories.json', 'suren.json'];

function syncCuratedContent() {
  const sourceDir = path.join(process.cwd(), 'content');
  const targetDir = path.join(process.cwd(), 'public', 'data');

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Kuratiertes Inhaltsverzeichnis fehlt: ${sourceDir}`);
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const file of FILES_TO_SYNC) {
    const sourceFile = path.join(sourceDir, file);
    const targetFile = path.join(targetDir, file);

    if (!fs.existsSync(sourceFile)) {
      throw new Error(`Kuratiertes Inhaltsfile fehlt: ${sourceFile}`);
    }

    fs.copyFileSync(sourceFile, targetFile);
  }

  console.log('Kuratierten Inhalt nach public/data synchronisiert.');
}

syncCuratedContent();

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const docsDir = path.join(rootDir, 'docs');
const outputFile = path.join(rootDir, 'docs-data.js');

function main() {
    const docsData = {};
    const files = fs
        .readdirSync(docsDir)
        .filter((file) => file.endsWith('.md'))
        .sort((left, right) => left.localeCompare(right));

    files.forEach((file) => {
        docsData[file] = fs.readFileSync(path.join(docsDir, file), 'utf8');
    });

    const content = `window.XINLIN_DOCS_DATA = ${JSON.stringify(docsData, null, 4)};\n`;
    fs.writeFileSync(outputFile, content, 'utf8');
    console.log(`Synced ${files.length} docs into ${path.basename(outputFile)}`);
}

main();

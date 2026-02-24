import fs from 'fs';
import path from 'path';
import { COUNTRY_DETAILS } from './src/data/worldTimesData.js'; // Note we're running under tsx probably, so .js extension might be required if "type": "module" in package.json, otherwise leave as without extension

const outputDir = path.join(__dirname, 'src', 'data', 'countries');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

let exportsList: string[] = [];
let reexportKeys: string[] = [];

for (const [key, detail] of Object.entries(COUNTRY_DETAILS)) {
    const folderName = key.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const countryDir = path.join(outputDir, folderName);
    const varName = folderName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

    if (!fs.existsSync(countryDir)) {
        fs.mkdirSync(countryDir, { recursive: true });
    }

    const tsContent = `import { CountryDetail } from '../../worldTimesData';\n\nexport const ${varName}: CountryDetail = ${JSON.stringify(detail, null, 4)};\n`;

    fs.writeFileSync(path.join(countryDir, 'index.ts'), tsContent, 'utf-8');

    exportsList.push(`import { ${varName} } from './${folderName}';`);
    reexportKeys.push(`    "${key}": ${varName}`);
}

const indexContent = `${exportsList.join('\n')}\n\nexport const countries = {\n${reexportKeys.join(',\n')}\n};\n`;
fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent, 'utf-8');

console.log('Extraction complete!');

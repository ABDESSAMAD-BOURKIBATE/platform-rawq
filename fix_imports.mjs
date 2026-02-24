import fs from 'fs';
import path from 'path';

const dir = './src/data/countries';
const subdirs = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory());

for (const subdir of subdirs) {
    const filePath = path.join(dir, subdir.name, 'index.ts');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        content = content.replace(/from '\.\.\/worldTimesData'/g, "from '../../worldTimesData'");
        fs.writeFileSync(filePath, content, 'utf-8');
    }
}
console.log("Imports fixed!");

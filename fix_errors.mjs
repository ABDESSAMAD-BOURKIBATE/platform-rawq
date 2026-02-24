import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src', 'data', 'countries');
const subdirs = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory());

let changedCount = 0;

for (const subdir of subdirs) {
    const filePath = path.join(dir, subdir.name, 'index.ts');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let original = content;
        
        // Remove city and cityAr fields
        content = content.replace(/^[ \t]*"city":[ \t]*"",?[ \r\n]*/gm, '');
        content = content.replace(/^[ \t]*"cityAr":[ \t]*"",?[ \r\n]*/gm, '');
        
        // Fix incorrect worldTimesData import path
        content = content.replace(/from '\.\.\/worldTimesData'/g, "from '../../worldTimesData'");
        
        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf-8');
            changedCount++;
        }
    }
}

console.log(`Fixed properties and imports in ${changedCount} files!`);

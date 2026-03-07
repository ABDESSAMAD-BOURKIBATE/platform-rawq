const fs = require('fs');
const path = require('path');

function findFiles(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) results.push(...findFiles(p));
        else if (entry.name.endsWith('.ts')) results.push(p);
    }
    return results;
}

const dir = path.join(__dirname, 'src', 'data');
const files = findFiles(dir);
const allQ = [];

for (const fl of files) {
    const c = fs.readFileSync(fl, 'utf-8');
    const re = /text:\s*'([^']+)'/g;
    let m;
    while ((m = re.exec(c)) !== null) {
        allQ.push({ t: m[1].trim(), f: path.relative(dir, fl) });
    }
}

console.log('Total questions found:', allQ.length);

// Find all duplicates
const textMap = new Map();
for (const q of allQ) {
    const k = q.t.replace(/\s+/g, ' ');
    if (!textMap.has(k)) textMap.set(k, []);
    textMap.get(k).push(q.f);
}

let dupeCount = 0;
const crossLevelDupes = [];
for (const [text, files] of textMap.entries()) {
    if (files.length > 1) {
        dupeCount++;
        // Check if it's cross-level (different level folders)
        const uniqueFiles = [...new Set(files)];
        if (uniqueFiles.length > 1) {
            crossLevelDupes.push({ text: text.substring(0, 80), files: uniqueFiles });
        }
    }
}

console.log('\nTotal duplicate question texts:', dupeCount);
console.log('Cross-file duplicates:', crossLevelDupes.length);
crossLevelDupes.slice(0, 50).forEach(d => {
    console.log('  DUP:', d.text);
    console.log('    IN:', d.files.join(', '));
});

// Count per file
const fileCounts = {};
for (const q of allQ) {
    fileCounts[q.f] = (fileCounts[q.f] || 0) + 1;
}
console.log('\n--- Questions per file ---');
const sorted = Object.entries(fileCounts).sort((a, b) => a[0].localeCompare(b[0]));
for (const [f, c] of sorted) {
    if (f.includes('level') || f === 'cultureQuestions.ts') {
        console.log(`  ${f}: ${c}`);
    }
}

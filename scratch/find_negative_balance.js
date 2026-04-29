const fs = require('fs');
const content = fs.readFileSync('src/admin/App.jsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 7247; i < 8094; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '{') balance++;
        if (char === '}') balance--;
        if (balance < 0) {
            console.log(`Balance negative at line ${i + 1}, col ${j + 1}`);
            return;
        }
    }
}
console.log('Balance never negative');

const fs = require('fs');
const content = fs.readFileSync('src/admin/App.jsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 7247; i < 8094; i++) {
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance of {} between 7248 and 8094: ${balance}`);

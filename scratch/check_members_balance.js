const fs = require('fs');
const content = fs.readFileSync('src/admin/App.jsx', 'utf8');
const lines = content.split('\n');

let balance = 0;
for (let i = 2837; i < 3374; i++) {
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance of {} in MembersPage: ${balance}`);

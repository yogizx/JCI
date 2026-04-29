const fs = require('fs');
const content = fs.readFileSync('src/admin/App.jsx', 'utf8');

let balance = 0;
let lineNum = 1;
for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') balance++;
    if (content[i] === '}') balance--;
    if (content[i] === '\n') lineNum++;
    
    if (balance < 0) {
        console.log(`Negative balance at line ${lineNum}: ${balance}`);
    }
}
console.log(`Final balance: ${balance}`);

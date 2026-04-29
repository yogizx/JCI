const fs = require('fs');
const content = fs.readFileSync('src/admin/App.jsx', 'utf8');

let stack = [];
let i = 0;
let line = 1;

while (i < content.length) {
    let char = content[i];
    if (char === '\n') line++;

    if (char === '/' && content[i+1] === '/') {
        while (i < content.length && content[i] !== '\n') i++;
        continue;
    }
    if (char === '/' && content[i+1] === '*') {
        i += 2;
        while (i < content.length && !(content[i] === '*' && content[i+1] === '/')) {
            if (content[i] === '\n') line++;
            i++;
        }
        i += 2;
        continue;
    }
    if (char === "'" || char === '"' || char === '`') {
        let quote = char;
        i++;
        while (i < content.length && content[i] !== quote) {
            if (content[i] === '\\') i++;
            if (content[i] === '\n') line++;
            i++;
        }
        i++;
        continue;
    }

    if (char === '{' || char === '(' || char === '[') {
        stack.push({ char, line });
    } else if (char === '}' || char === ')' || char === ']') {
        if (stack.length === 0) {
            console.log(`Extra ${char} at line ${line}`);
        } else {
            let last = stack.pop();
            let match = false;
            if (char === '}' && last.char === '{') match = true;
            if (char === ')' && last.char === '(') match = true;
            if (char === ']' && last.char === '[') match = true;
            
            if (!match) {
                console.log(`Mismatch at line ${line}: ${char} closed ${last.char} from line ${last.line}`);
                // return; // Stop at first mismatch
            }
        }
    }
    i++;
}

console.log('Open items at the end:');
stack.forEach(s => console.log(`${s.char} at line ${s.line}`));

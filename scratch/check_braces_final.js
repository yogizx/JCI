const fs = require('fs');
const content = fs.readFileSync('src/admin/App.jsx', 'utf8');

let stack = [];
let i = 0;
let line = 1;

while (i < content.length) {
    let char = content[i];
    if (char === '\n') line++;

    // Skip strings first
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

    // Skip comments
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

    if (char === '{' || char === '(' || char === '[') {
        stack.push({ char, line });
    } else if (char === '}' || char === ')' || char === ']') {
        if (stack.length > 0) {
            let last = stack[stack.length - 1];
            if ((char === '}' && last.char === '{') ||
                (char === ')' && last.char === '(') ||
                (char === ']' && last.char === '[')) {
                stack.pop();
            }
        }
    }
    i++;
}

console.log('Open items at the end:');
stack.forEach(s => console.log(`${s.char} at line ${s.line}`));

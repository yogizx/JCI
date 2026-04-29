const fs = require('fs');
const content = fs.readFileSync('src/admin/App.jsx', 'utf8');

const stack = [];
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '{' || char === '(' || char === '[') {
            stack.push({ char, line: i + 1 });
        } else if (char === '}' || char === ')' || char === ']') {
            if (stack.length === 0) {
                console.log(`Extra ${char} at line ${i + 1}`);
                continue;
            }
            const last = stack.pop();
            if ((char === '}' && last.char !== '{') ||
                (char === ')' && last.char !== '(') ||
                (char === ']' && last.char !== '[')) {
                console.log(`Mismatch: ${last.char} at line ${last.line} with ${char} at line ${i + 1}`);
            }
        }
    }
}
if (stack.length > 0) {
    stack.forEach(s => console.log(`Unclosed ${s.char} at line ${s.line}`));
} else {
    console.log('All balanced');
}

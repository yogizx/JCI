const fs = require('fs');
const content = fs.readFileSync('src/admin/App.jsx', 'utf8');

let inString = false;
let quoteChar = '';
let escaped = false;
let lineNum = 1;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '\n') lineNum++;

    if (escaped) {
        escaped = false;
        continue;
    }

    if (char === '\\') {
        escaped = true;
        continue;
    }

    if (!inString) {
        if (char === "'" || char === '"' || char === '`') {
            inString = true;
            quoteChar = char;
            startLine = lineNum;
        }
    } else {
        if (char === quoteChar) {
            inString = false;
        }
    }
}

if (inString) {
    console.log(`Unclosed string/backtick starting at line ${startLine} with char ${quoteChar}`);
} else {
    console.log('All strings closed');
}

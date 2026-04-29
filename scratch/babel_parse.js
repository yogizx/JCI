const parser = require('@babel/parser');
const fs = require('fs');

const code = fs.readFileSync('src/admin/App.jsx', 'utf8');

try {
    parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'] // and others if needed
    });
    console.log('Parsed successfully');
} catch (e) {
    console.log(`Error: ${e.message} at line ${e.loc.line}, column ${e.loc.column}`);
}

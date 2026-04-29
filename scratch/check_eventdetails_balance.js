const fs = require('fs');
const content = fs.readFileSync('src/admin/App.jsx', 'utf8');
const lines = content.split('\n');

// Check {} balance in EventDetailsPage (6918 to 7240)
let balance = 0;
for (let i = 6917; i < 7240; i++) {
    const line = lines[i];
    for (let char of line) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
}
console.log(`Balance of {} in EventDetailsPage: ${balance}`);

// Check () balance in EventDetailsPage (6918 to 7240)
let pBalance = 0;
for (let i = 6917; i < 7240; i++) {
    const line = lines[i];
    for (let char of line) {
        if (char === '(') pBalance++;
        if (char === ')') pBalance--;
    }
}
console.log(`Balance of () in EventDetailsPage: ${pBalance}`);

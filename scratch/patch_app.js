const fs = require('fs');

const appJsxPath = 'src/admin/App.jsx';
const pagesPath = 'scratch/admin_pages.jsx';

const appLines = fs.readFileSync(appJsxPath, 'utf8').split('\n');
const pagesLines = fs.readFileSync(pagesPath, 'utf8').split('\n');

const startIdx = 4583; // Line 4584 is index 4583
const endIdx = 5332; // Line 5332 is index 5331, we remove up to 5332 to cover it perfectly

const newAppLines = [
  ...appLines.slice(0, startIdx),
  ...pagesLines,
  ...appLines.slice(endIdx) // This leaves line 5333 onwards intact
];

fs.writeFileSync(appJsxPath, newAppLines.join('\n'));
console.log('Successfully updated App.jsx');

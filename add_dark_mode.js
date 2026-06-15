const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Backgrounds
    content = content.replace(/bg-\[#F5F3F0\](?! dark:bg-)/g, 'bg-[#F5F3F0] dark:bg-[#09090b]');
    content = content.replace(/bg-\[#F8F9FA\](?! dark:bg-)/g, 'bg-[#F8F9FA] dark:bg-[#09090b]');
    content = content.replace(/bg-white(?!(\/| dark:bg-))/g, 'bg-white dark:bg-[#18181b]');
    
    // Text colors
    content = content.replace(/text-\[#121110\](?! dark:text-)/g, 'text-[#121110] dark:text-white');
    content = content.replace(/text-\[#61605D\](?! dark:text-)/g, 'text-[#61605D] dark:text-gray-400');
    content = content.replace(/text-gray-900(?! dark:text-)/g, 'text-gray-900 dark:text-white');
    content = content.replace(/text-[#1A1C1E](?! dark:text-)/g, 'text-[#1A1C1E] dark:text-white');
    content = content.replace(/text-gray-500(?! dark:text-)/g, 'text-gray-500 dark:text-gray-400');
    content = content.replace(/text-gray-600(?! dark:text-)/g, 'text-gray-600 dark:text-gray-300');
    
    // Borders
    content = content.replace(/border-white\/40(?! dark:border-)/g, 'border-white/40 dark:border-white/10');
    content = content.replace(/border-gray-100(?! dark:border-)/g, 'border-gray-100 dark:border-gray-800');
    content = content.replace(/border-\[#E2E8F0\](?! dark:border-)/g, 'border-[#E2E8F0] dark:border-gray-800');

    fs.writeFileSync(filePath, content, 'utf8');
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

traverseDir(path.join(__dirname, 'src'));
console.log('Finished updating dark mode classes.');

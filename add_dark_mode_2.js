const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Backgrounds with or without opacity
    content = content.replace(/bg-white(?!\/)(?! dark:bg-)/g, 'bg-white dark:bg-[#18181b]');
    content = content.replace(/bg-white\/80(?! dark:bg-)/g, 'bg-white/80 dark:bg-[#18181b]/80');
    content = content.replace(/bg-white\/70(?! dark:bg-)/g, 'bg-white/70 dark:bg-[#18181b]/70');
    content = content.replace(/bg-white\/50(?! dark:bg-)/g, 'bg-white/50 dark:bg-[#18181b]/50');

    // Light grays to dark gray
    content = content.replace(/bg-gray-50(?!\/)(?! dark:bg-)/g, 'bg-gray-50 dark:bg-[#27272a]');
    content = content.replace(/bg-gray-100(?!\/)(?! dark:bg-)/g, 'bg-gray-100 dark:bg-[#27272a]');
    
    // Borders
    content = content.replace(/border-gray-200(?! dark:border-)/g, 'border-gray-200 dark:border-white/10');
    content = content.replace(/border-gray-100(?! dark:border-)/g, 'border-gray-100 dark:border-white/5');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
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
console.log('Finished updating more dark mode classes.');

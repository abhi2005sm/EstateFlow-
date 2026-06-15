const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Backgrounds
    content = content.replace(/bg-white(?!\/)(?! dark:bg-)/g, 'bg-white dark:bg-[#121212]');
    content = content.replace(/bg-white\/80(?! dark:bg-)/g, 'bg-white/80 dark:bg-[#121212]/80');
    content = content.replace(/bg-white\/70(?! dark:bg-)/g, 'bg-white/70 dark:bg-[#121212]/70');
    content = content.replace(/bg-white\/50(?! dark:bg-)/g, 'bg-white/50 dark:bg-[#121212]/50');

    // Light grays / specific colors to pure dark / dark gray
    content = content.replace(/bg-[#F5F3F0](?! dark:bg-)/g, 'bg-[#F5F3F0] dark:bg-[#000000]');
    content = content.replace(/bg-[#F8F9FA](?! dark:bg-)/g, 'bg-[#F8F9FA] dark:bg-[#000000]');
    content = content.replace(/bg-gray-50(?!\/)(?! dark:bg-)/g, 'bg-gray-50 dark:bg-[#262626]');
    content = content.replace(/bg-gray-100(?!\/)(?! dark:bg-)/g, 'bg-gray-100 dark:bg-[#262626]');
    
    // Text
    content = content.replace(/text-gray-900(?! dark:text-)/g, 'text-gray-900 dark:text-white');
    content = content.replace(/text-gray-800(?! dark:text-)/g, 'text-gray-800 dark:text-white');
    content = content.replace(/text-gray-700(?! dark:text-)/g, 'text-gray-700 dark:text-gray-200');
    content = content.replace(/text-[#121110](?! dark:text-)/g, 'text-[#121110] dark:text-white');
    content = content.replace(/text-[#1A1C1E](?! dark:text-)/g, 'text-[#1A1C1E] dark:text-white');
    
    // Links / Blue text
    content = content.replace(/text-blue-600(?! dark:text-)/g, 'text-blue-600 dark:text-white');
    content = content.replace(/text-blue-500(?! dark:text-)/g, 'text-blue-500 dark:text-white');
    
    // Borders
    content = content.replace(/border-gray-100(?! dark:border-)/g, 'border-gray-100 dark:border-[#363636]');
    content = content.replace(/border-gray-200(?! dark:border-)/g, 'border-gray-200 dark:border-[#363636]');
    content = content.replace(/border-gray-300(?! dark:border-)/g, 'border-gray-300 dark:border-[#363636]');
    content = content.replace(/border-\[#E2E8F0\](?! dark:border-)/g, 'border-[#E2E8F0] dark:border-[#363636]');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function traverseDir(dir) {
    if (!fs.existsSync(dir)) return;
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
traverseDir(path.join(__dirname, 'app'));
console.log('Finished deep updating all dark mode classes.');

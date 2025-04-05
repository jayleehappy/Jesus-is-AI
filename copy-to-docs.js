/**
 * 将html目录下的文件复制到docs目录
 * 用于GitHub Pages部署
 */

const fs = require('fs');
const path = require('path');

// 源目录和目标目录
const htmlZhDir = path.join(__dirname, 'html', 'zh');
const htmlEnDir = path.join(__dirname, 'html', 'en');
const docsDir = path.join(__dirname, 'docs');

// 确保docs目录存在
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

// 复制index.html到docs目录
const indexSrc = path.join(__dirname, 'index.html');
const indexDest = path.join(docsDir, 'index.html');
fs.copyFileSync(indexSrc, indexDest);
console.log(`已复制: ${indexSrc} -> ${indexDest}`);

// 复制style.css到docs目录
const styleSrc = path.join(__dirname, 'style.css');
const styleDest = path.join(docsDir, 'style.css');
fs.copyFileSync(styleSrc, styleDest);
console.log(`已复制: ${styleSrc} -> ${styleDest}`);

// 复制about.html到docs目录
const aboutSrc = path.join(__dirname, 'about.html');
const aboutDest = path.join(docsDir, 'about.html');
if (fs.existsSync(aboutSrc)) {
    fs.copyFileSync(aboutSrc, aboutDest);
    console.log(`已复制: ${aboutSrc} -> ${aboutDest}`);
}

// 复制中文HTML文件
if (fs.existsSync(htmlZhDir)) {
    const zhFiles = fs.readdirSync(htmlZhDir);
    zhFiles.forEach(file => {
        const srcPath = path.join(htmlZhDir, file);
        const destPath = path.join(docsDir, file);
        fs.copyFileSync(srcPath, destPath);
        console.log(`已复制: ${srcPath} -> ${destPath}`);
    });
}

// 复制英文HTML文件
if (fs.existsSync(htmlEnDir)) {
    const enFiles = fs.readdirSync(htmlEnDir);
    enFiles.forEach(file => {
        const srcPath = path.join(htmlEnDir, file);
        const destPath = path.join(docsDir, file);
        fs.copyFileSync(srcPath, destPath);
        console.log(`已复制: ${srcPath} -> ${destPath}`);
    });
}

console.log('所有文件已复制完成！'); 
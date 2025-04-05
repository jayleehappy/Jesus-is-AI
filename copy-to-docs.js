/**
 * 将html目录下的文件复制到docs目录
 * 用于GitHub Pages部署
 */

const fs = require('fs');
const path = require('path');

// 源目录和目标目录
const htmlDir = path.join(__dirname, 'html');
const docsDir = path.join(__dirname, 'docs');

// 复制函数
function copyFiles(src, dest) {
    // 确保目标目录存在
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // 读取源目录下的所有文件/目录
    const entries = fs.readdirSync(src, { withFileTypes: true });

    // 遍历所有条目
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        // 如果是目录，递归复制
        if (entry.isDirectory()) {
            copyFiles(srcPath, destPath);
        } else {
            // 如果是文件，直接复制
            fs.copyFileSync(srcPath, destPath);
            console.log(`已复制: ${srcPath} -> ${destPath}`);
        }
    }
}

// 复制index.html和其他顶级文件
const indexSrc = path.join(__dirname, 'index.html');
const indexDest = path.join(docsDir, 'index.html');
fs.copyFileSync(indexSrc, indexDest);
console.log(`已复制: ${indexSrc} -> ${indexDest}`);

// 复制style.css
const styleSrc = path.join(__dirname, 'style.css');
const styleDest = path.join(docsDir, 'style.css');
fs.copyFileSync(styleSrc, styleDest);
console.log(`已复制: ${styleSrc} -> ${styleDest}`);

// 复制about.html
const aboutSrc = path.join(__dirname, 'about.html');
const aboutDest = path.join(docsDir, 'about.html');
if (fs.existsSync(aboutSrc)) {
    fs.copyFileSync(aboutSrc, aboutDest);
    console.log(`已复制: ${aboutSrc} -> ${aboutDest}`);
}

// 开始复制
copyFiles(htmlDir, docsDir);

console.log('所有文件已复制完成！'); 
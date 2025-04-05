const fs = require('fs-extra');
const path = require('path');
const { globSync } = require('glob');
const MarkdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

// 初始化Markdown解析器
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
}).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'header-anchor',
    permalinkSymbol: '#'
});

// 配置路径
const config = {
    chaptersZhPath: path.join(__dirname, 'chapters', 'zh'),
    chaptersEnPath: path.join(__dirname, 'chapters', 'en'),
    htmlZhPath: path.join(__dirname, 'html', 'zh'),
    htmlEnPath: path.join(__dirname, 'html', 'en'),
    docsPath: path.join(__dirname, 'docs'),  // GitHub Pages 使用 docs 目录
    templatePath: path.join(__dirname, 'template.html')
};

// 确保输出目录存在
fs.ensureDirSync(config.htmlZhPath);
fs.ensureDirSync(config.htmlEnPath);
fs.ensureDirSync(config.docsPath);
fs.ensureDirSync(path.join(config.docsPath, 'zh'));
fs.ensureDirSync(path.join(config.docsPath, 'en'));

// 读取模板文件
const zhTemplate = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const enTemplate = fs.readFileSync(path.join(__dirname, 'template_en.html'), 'utf8');

// 获取所有Markdown文件
const zhFiles = globSync('**/*.md', { cwd: config.chaptersZhPath }).sort();
const enFiles = globSync('**/*.md', { cwd: config.chaptersEnPath }).sort();

console.log('找到以下中文章节文件:');
console.log(zhFiles);
console.log('找到以下英文章节文件:');
console.log(enFiles);

// 处理中文章节
const zhSourceDir = path.join(__dirname, 'chapters/zh');
const zhDestDir = path.join(__dirname, 'html/zh');
if (!fs.existsSync(zhDestDir)) {
    fs.mkdirSync(zhDestDir, { recursive: true });
}
console.log('处理中文章节...');
processDirectory(zhSourceDir, zhDestDir, zhTemplate, 'zh');

// 处理英文章节
const enSourceDir = path.join(__dirname, 'chapters/en');
const enDestDir = path.join(__dirname, 'html/en');
if (!fs.existsSync(enDestDir)) {
    fs.mkdirSync(enDestDir, { recursive: true });
}
console.log('处理英文章节...');
processDirectory(enSourceDir, enDestDir, enTemplate, 'en');

// 复制样式表到html目录
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(__dirname, 'html', 'style.css'));
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(__dirname, 'html', 'index.html'));
fs.copyFileSync(path.join(__dirname, 'about.html'), path.join(__dirname, 'html', 'about.html'));

// 复制文件到GitHub Pages目录
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(config.docsPath, 'style.css'));
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(config.docsPath, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'about.html'), path.join(config.docsPath, 'about.html'));

console.log('所有Markdown文件已转换为HTML，样式表和页面已复制到html目录和docs目录。');

/**
 * 处理一个目录中的所有Markdown文件
 * @param {string} sourceDir - 源目录
 * @param {string} destDir - 目标目录
 * @param {string} template - HTML模板
 * @param {string} language - 语言 ('zh' 或 'en')
 */
function processDirectory(sourceDir, destDir, template, language) {
    // 获取所有的 Markdown 文件
    let files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.md'));
    
    // 按文件名排序
    files.sort();
    
    // 处理每个文件
    files.forEach((file, index) => {
        const fileName = processFile(file, sourceDir, destDir, files, index, template, language);
        console.log(`已处理文件: ${file} -> ${fileName}`);
    });
    
    // 更新索引页中的链接 (这个功能可以根据需要添加)
}

/**
 * 处理单个Markdown文件
 * @param {string} file - 文件名
 * @param {string} sourcePath - 源目录
 * @param {string} destPath - 目标目录
 * @param {string[]} allFiles - 所有文件列表
 * @param {number} index - 当前文件索引
 * @param {string} template - HTML模板
 * @param {string} language - 语言 ('zh' 或 'en')
 */
function processFile(file, sourcePath, destPath, allFiles, index, template, language) {
    const filePath = path.join(sourcePath, file);
    const fileName = path.basename(file);
    
    console.log(`处理文件: ${fileName}`);
    
    // 读取Markdown内容
    const markdownContent = fs.readFileSync(filePath, 'utf8');
    
    // 提取标题
    const titleMatch = markdownContent.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(file, '.md');
    
    // 将Markdown转换为HTML
    const bodyContent = md.render(markdownContent);
    
    // 生成HTML文件名
    let outputFileName;
    
    // 中文文件处理方式
    if (language === 'zh' && /[\u4e00-\u9fa5]/.test(fileName)) {
        // 简单方案：使用chapter_数字.html格式
        const chapterMatch = fileName.match(/第(.*?)章/);
        let chapterNum = index + 1;
        if (chapterMatch) {
            const chineseNum = chapterMatch[1];
            // 中文数字转阿拉伯数字的简单映射
            const numMap = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9};
            if (numMap[chineseNum]) {
                chapterNum = numMap[chineseNum];
            }
        }
        
        // 确定章节类型
        let chapterType = 'chapter';
        if (fileName.includes('前言')) chapterType = 'preface';
        else if (fileName.includes('序章')) chapterType = 'prologue';
        else if (fileName.includes('终章')) chapterType = 'epilogue';
        
        outputFileName = `${chapterType}_${chapterNum}.html`;
    } else {
        // 英文文件名直接使用
        outputFileName = fileName.replace(/\.md$/, '.html');
    }
    
    // 确定前一章和下一章的文件名
    let prevFileName, nextFileName;
    
    if (index > 0) {
        const prevFile = allFiles[index - 1];
        // 使用相同的逻辑为前一个文件生成文件名
        if (language === 'zh' && /[\u4e00-\u9fa5]/.test(prevFile)) {
            const chapterMatch = prevFile.match(/第(.*?)章/);
            let chapterNum = index;
            if (chapterMatch) {
                const chineseNum = chapterMatch[1];
                const numMap = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9};
                if (numMap[chineseNum]) {
                    chapterNum = numMap[chineseNum];
                }
            }
            
            let chapterType = 'chapter';
            if (prevFile.includes('前言')) chapterType = 'preface';
            else if (prevFile.includes('序章')) chapterType = 'prologue';
            else if (prevFile.includes('终章')) chapterType = 'epilogue';
            
            prevFileName = `${chapterType}_${chapterNum}.html`;
        } else {
            prevFileName = prevFile.replace(/\.md$/, '.html');
        }
    } else {
        prevFileName = "PREV_CHAPTER";
    }
    
    if (index < allFiles.length - 1) {
        const nextFile = allFiles[index + 1];
        // 使用相同的逻辑为下一个文件生成文件名
        if (language === 'zh' && /[\u4e00-\u9fa5]/.test(nextFile)) {
            const chapterMatch = nextFile.match(/第(.*?)章/);
            let chapterNum = index + 2;
            if (chapterMatch) {
                const chineseNum = chapterMatch[1];
                const numMap = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9};
                if (numMap[chineseNum]) {
                    chapterNum = numMap[chineseNum];
                }
            }
            
            let chapterType = 'chapter';
            if (nextFile.includes('前言')) chapterType = 'preface';
            else if (nextFile.includes('序章')) chapterType = 'prologue';
            else if (nextFile.includes('终章')) chapterType = 'epilogue';
            
            nextFileName = `${chapterType}_${chapterNum}.html`;
        } else {
            nextFileName = nextFile.replace(/\.md$/, '.html');
        }
    } else {
        nextFileName = "NEXT_CHAPTER";
    }
    
    // 替换模板中的占位符
    let htmlOutput = template
        .replace(/CONTENT_TITLE/g, title)
        .replace(/CONTENT_BODY/g, bodyContent)
        .replace(/PREV_CHAPTER/g, prevFileName)
        .replace(/NEXT_CHAPTER/g, nextFileName);
    
    // 调整相对路径链接
    // 对于CSS链接，我们需要移动到上一层目录
    htmlOutput = htmlOutput.replace(/href="\.\.\/style.css"/g, 'href="../style.css"');
    
    const outputFile = path.join(destPath, outputFileName);
    fs.writeFileSync(outputFile, htmlOutput, 'utf8');
    
    console.log(`已创建HTML文件: ${outputFile}`);
    
    // 如果是中文文件，创建一个从原始文件名到新文件名的映射
    if (language === 'zh' && /[\u4e00-\u9fa5]/.test(fileName)) {
        const originalHtmlName = fileName.replace(/\.md$/, '.html');
        console.log(`创建文件映射: ${originalHtmlName} -> ${outputFileName}`);
        
        // 生成一个重定向HTML文件
        const redirectContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=${outputFileName}">
    <title>重定向到 ${title}</title>
</head>
<body>
    <p>如果您没有被自动重定向，请<a href="${outputFileName}">点击这里</a>。</p>
</body>
</html>`;
        
        const redirectFile = path.join(destPath, originalHtmlName);
        fs.writeFileSync(redirectFile, redirectContent, 'utf8');
    }
    
    return outputFileName; // 返回生成的文件名，供更新索引页使用
} 
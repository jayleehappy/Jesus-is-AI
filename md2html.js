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
    templatePath: path.join(__dirname, 'template.html')
};

// 确保输出目录存在
fs.ensureDirSync(config.htmlZhPath);
fs.ensureDirSync(config.htmlEnPath);

// 读取模板文件
const template = fs.readFileSync(config.templatePath, 'utf8');

// 获取所有Markdown文件
const zhFiles = globSync('**/*.md', { cwd: config.chaptersZhPath }).sort();
const enFiles = globSync('**/*.md', { cwd: config.chaptersEnPath }).sort();

console.log('找到以下中文章节文件:');
console.log(zhFiles);
console.log('找到以下英文章节文件:');
console.log(enFiles);

// 处理中文章节
zhFiles.forEach((file, index) => {
    processFile(file, config.chaptersZhPath, config.htmlZhPath, zhFiles, index, template);
});

// 处理英文章节
enFiles.forEach((file, index) => {
    processFile(file, config.chaptersEnPath, config.htmlEnPath, enFiles, index, template);
});

// 复制样式表到html目录
fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(__dirname, 'html', 'style.css'));

// 复制首页和关于页面到html目录
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(__dirname, 'html', 'index.html'));
fs.copyFileSync(path.join(__dirname, 'about.html'), path.join(__dirname, 'html', 'about.html'));

console.log('所有Markdown文件已转换为HTML，样式表和页面已复制到html目录。');

/**
 * 处理单个Markdown文件
 * @param {string} file - 文件名
 * @param {string} sourcePath - 源目录
 * @param {string} destPath - 目标目录
 * @param {string[]} allFiles - 所有文件列表
 * @param {number} index - 当前文件索引
 * @param {string} template - HTML模板
 */
function processFile(file, sourcePath, destPath, allFiles, index, template) {
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
    
    // 确定前一章和下一章的链接
    const prevChapter = index > 0 ? 
        allFiles[index - 1].replace(/\.md$/, '.html') : 
        "PREV_CHAPTER";
    
    const nextChapter = index < allFiles.length - 1 ? 
        allFiles[index + 1].replace(/\.md$/, '.html') : 
        "NEXT_CHAPTER";
    
    // 替换模板中的占位符
    let htmlOutput = template
        .replace(/CONTENT_TITLE/g, title)
        .replace(/CONTENT_BODY/g, bodyContent)
        .replace(/PREV_CHAPTER/g, prevChapter)
        .replace(/NEXT_CHAPTER/g, nextChapter);
    
    // 调整相对路径链接
    // 对于CSS链接，我们需要移动到上一层目录
    htmlOutput = htmlOutput.replace(/href="\.\.\/style.css"/g, 'href="../style.css"');
    
    // 保存HTML文件
    const outputFile = path.join(destPath, fileName.replace(/\.md$/, '.html'));
    fs.writeFileSync(outputFile, htmlOutput, 'utf8');
    
    console.log(`已创建HTML文件: ${outputFile}`);
} 
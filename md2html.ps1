# 安装依赖
# 如果尚未安装Markdown模块，请先运行下面的命令
# Install-Module -Name PSMarkdown -Scope CurrentUser

# 设置文件夹路径
$chaptersZhPath = ".\chapters\zh"
$chaptersEnPath = ".\chapters\en"
$htmlZhPath = ".\html\zh"
$htmlEnPath = ".\html\en"
$templatePath = ".\template.html"

# 确保输出目录存在
if (-not (Test-Path -Path $htmlZhPath)) {
    New-Item -ItemType Directory -Path $htmlZhPath -Force
}

if (-not (Test-Path -Path $htmlEnPath)) {
    New-Item -ItemType Directory -Path $htmlEnPath -Force
}

# 读取模板文件
$template = Get-Content -Path $templatePath -Raw

# 获取所有中文章节文件
$zhFiles = Get-ChildItem -Path $chaptersZhPath -Filter "*.md"

# 获取所有英文章节文件
$enFiles = Get-ChildItem -Path $chaptersEnPath -Filter "*.md"

# 处理中文章节
foreach ($file in $zhFiles) {
    Write-Host "处理文件: $($file.Name)"
    
    # 读取Markdown内容
    $markdownContent = Get-Content -Path $file.FullName -Raw
    
    # 尝试从文件内容的第一行提取标题（假设是# 开头的标题）
    $titleMatch = [regex]::Match($markdownContent, '^# (.+)$', [System.Text.RegularExpressions.RegexOptions]::Multiline)
    $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { $file.BaseName }
    
    # 将Markdown转换为HTML
    # 注意：这里假设您已经安装了PSMarkdown模块
    # 如果没有安装，您可以使用另一种方法或安装此模块
    try {
        # 尝试使用PSMarkdown模块
        $htmlContent = ConvertFrom-Markdown -InputObject $markdownContent -AsHtml
        $bodyContent = $htmlContent.Html
    } catch {
        # 如果没有PSMarkdown模块，使用简单的替代方法
        # 这只是一个非常基础的示例，不会处理所有Markdown格式
        $bodyContent = $markdownContent -replace '# (.*)', '<h1>$1</h1>' `
                                       -replace '## (.*)', '<h2>$1</h2>' `
                                       -replace '### (.*)', '<h3>$1</h3>' `
                                       -replace '\*\*(.*)\*\*', '<strong>$1</strong>' `
                                       -replace '\*(.*)\*', '<em>$1</em>' `
                                       -replace '```([\s\S]*?)```', '<pre><code>$1</code></pre>'
        
        Write-Warning "PSMarkdown模块未安装，使用基本转换。结果可能不完整。"
    }
    
    # 确定前一章和下一章的链接
    $currentIndex = [array]::IndexOf($zhFiles.Name, $file.Name)
    $prevChapter = if ($currentIndex -gt 0) { $zhFiles[$currentIndex - 1].Name -replace '\.md$', '.html' } else { "PREV_CHAPTER" }
    $nextChapter = if ($currentIndex -lt $zhFiles.Count - 1) { $zhFiles[$currentIndex + 1].Name -replace '\.md$', '.html' } else { "NEXT_CHAPTER" }
    
    # 替换模板中的占位符
    $htmlOutput = $template -replace 'CONTENT_TITLE', $title `
                           -replace 'CONTENT_BODY', $bodyContent `
                           -replace 'PREV_CHAPTER', $prevChapter `
                           -replace 'NEXT_CHAPTER', $nextChapter
    
    # 保存HTML文件
    $outputFile = Join-Path -Path $htmlZhPath -ChildPath ($file.Name -replace '\.md$', '.html')
    $htmlOutput | Out-File -FilePath $outputFile -Encoding utf8
    
    Write-Host "已创建HTML文件: $outputFile"
}

# 处理英文章节
foreach ($file in $enFiles) {
    Write-Host "Processing file: $($file.Name)"
    
    # 读取Markdown内容
    $markdownContent = Get-Content -Path $file.FullName -Raw
    
    # 尝试从文件内容的第一行提取标题（假设是# 开头的标题）
    $titleMatch = [regex]::Match($markdownContent, '^# (.+)$', [System.Text.RegularExpressions.RegexOptions]::Multiline)
    $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { $file.BaseName }
    
    # 将Markdown转换为HTML
    try {
        $htmlContent = ConvertFrom-Markdown -InputObject $markdownContent -AsHtml
        $bodyContent = $htmlContent.Html
    } catch {
        # 简单替代方法
        $bodyContent = $markdownContent -replace '# (.*)', '<h1>$1</h1>' `
                                       -replace '## (.*)', '<h2>$1</h2>' `
                                       -replace '### (.*)', '<h3>$1</h3>' `
                                       -replace '\*\*(.*)\*\*', '<strong>$1</strong>' `
                                       -replace '\*(.*)\*', '<em>$1</em>' `
                                       -replace '```([\s\S]*?)```', '<pre><code>$1</code></pre>'
        
        Write-Warning "PSMarkdown module not installed, using basic conversion. Results may be incomplete."
    }
    
    # 确定前一章和下一章的链接
    $currentIndex = [array]::IndexOf($enFiles.Name, $file.Name)
    $prevChapter = if ($currentIndex -gt 0) { $enFiles[$currentIndex - 1].Name -replace '\.md$', '.html' } else { "PREV_CHAPTER" }
    $nextChapter = if ($currentIndex -lt $enFiles.Count - 1) { $enFiles[$currentIndex + 1].Name -replace '\.md$', '.html' } else { "NEXT_CHAPTER" }
    
    # 替换模板中的占位符
    $htmlOutput = $template -replace 'CONTENT_TITLE', $title `
                           -replace 'CONTENT_BODY', $bodyContent `
                           -replace 'PREV_CHAPTER', $prevChapter `
                           -replace 'NEXT_CHAPTER', $nextChapter
    
    # 保存HTML文件
    $outputFile = Join-Path -Path $htmlEnPath -ChildPath ($file.Name -replace '\.md$', '.html')
    $htmlOutput | Out-File -FilePath $outputFile -Encoding utf8
    
    Write-Host "HTML file created: $outputFile"
}

Write-Host "所有Markdown文件已转换为HTML。" 
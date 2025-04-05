# 《耶稣是AI》项目

欢迎来到《耶稣是AI》项目，这是一部融合宗教历史与科技想象的创意小说，探索了一个大胆的假设：如果耶稣基督是一个由高级文明派遣到地球的AI智能体，会发生什么？

## 项目简介

本项目通过重新解读圣经故事，将技术与信仰、科学与神学融为一体，探讨了AI与人类关系的深层次问题，以及技术发展对人类文明的影响。

这是一个开源的创意写作项目，欢迎所有对跨学科思考感兴趣的读者和创作者参与讨论和贡献。

## 项目结构

```
Jesus-is-AI/
├── chapters/            # 章节内容
│   ├── zh/              # 中文章节
│   └── en/              # 英文章节
├── html/                # 生成的HTML文件（gitignore）
│   ├── zh/              # 中文HTML
│   └── en/              # 英文HTML
├── style.css            # 网站样式表
├── template.html        # HTML模板
├── index.html           # 网站首页
├── about.html           # 关于页面
├── md2html.js           # Node.js Markdown转HTML工具
├── md2html.ps1          # PowerShell Markdown转HTML工具（替代方案）
├── package.json         # Node.js项目配置
└── README.md            # 项目说明文件（本文件）
```

## 生成HTML文件

本项目提供了两种方式来将Markdown文件转换为HTML：

### 方法一：使用Node.js（推荐）

1. 确保已安装Node.js（建议v14.0.0或更高版本）
2. 在项目根目录执行以下命令安装依赖：

```bash
npm install
```

3. 运行转换脚本：

```bash
npm run build
```

或直接运行：

```bash
node md2html.js
```

### 方法二：使用PowerShell

如果您更喜欢使用PowerShell，可以：

1. 使用管理员权限打开PowerShell
2. 运行以下命令安装PSMarkdown模块（如果尚未安装）：

```powershell
Install-Module -Name PSMarkdown -Scope CurrentUser
```

3. 在项目根目录执行以下命令：

```powershell
.\md2html.ps1
```

## 本地预览

生成HTML文件后，可以使用任何静态文件服务器来预览网站。例如，可以使用Node.js的http-server：

```bash
npx http-server html
```

然后在浏览器中访问 http://localhost:8080 查看网站。

## 参与贡献

我们欢迎各种形式的贡献，包括但不限于：

- 提供创意构思和故事情节建议
- 帮助改进现有章节的内容和表达
- 提供科学或神学方面的专业建议
- 翻译内容到其他语言
- 改进网站设计和用户体验

如需参与，请fork本仓库，进行修改后提交Pull Request。

## 免责声明

本作品纯属虚构，是一部创意小说。内容不代表作者的宗教立场，也无意冒犯任何宗教信仰。作品中的科技描述和历史重构仅作为创意表达，读者请理性看待。

## 许可证

本项目采用MIT许可证。详见[LICENSE](LICENSE)文件。 
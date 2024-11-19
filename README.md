## 基于Pnpm Workspace管理多端大前端统一的MonoRepo单体式仓库 单仓多包代码架构 JavaScript技术栈

### 项目代号: athena(雅典娜 智慧女神) 愿景: 使项目更易于复用迭代维护扩展、分离关注点并避免代码重复

### monorepo 最主要的好处是统一的工作流和共享代码, 兼顾通用性和独立性之间的最佳平衡点, 统一最佳实战只需搭建一套脚手架, 统一管理(规范、配置、开发、联调、构建、测试、发布等)多个包
#### Vite与TurboRepo解决Monorepo多项目构建缓慢问题 充分利用CPU性能并发构建提速

### 目录结构

- packages: 可复用的基础通用包
- projects-*: 多端项目业务包
- templates: 自定义灵活高效的代码生成器
- scripts: 自定义脚本 管理复杂多项目
- docs: 项目文档
- examples: 示例代码 常用代码模板和代码块提炼
- tests: 测试模块

### Web技术栈

- React
- Vue
- TypeScript
- Pnpm
- Vite Vitest
- Tailwind CSS
- CSS Variables
- Lodash
- shadcn/ui or Ant Design

#### 安装Pnpm相关依赖

npm i -g pnpm && npm i -g gulp && pnpm i

#### 安装编译所有依赖 建立link软连接

npm run bootstrap:all

#### 在package.json目录下引入monorepo公共依赖

"athena-core": "workspace:*"

#### 基础通用包和业务包实时调试

- 执行根目录封装的命令 npm run watch:ts
- 根据文件监听变化实时响应联调结果 tsc --watch 单独开启服务


# 使用Node.js 基础镜像（Alpine版本更轻量）
FROM node:22-alpine

# 设置时区与环境变量（避免中文乱码）
ENV TZ=Asia/Shanghai \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    SHELL=/bin/bash

# 配置npm镜像源（国内加速）
RUN npm config set registry https://registry.npmmirror.com

# 创建工作目录并复制依赖文件（利用Docker缓存优化）
WORKDIR /code
COPY package*.json ./

# 安装依赖（强制安装避免peerDependencies冲突）
RUN npm install --force

# 复制项目代码（实际开发时建议通过Volume挂载实时同步）
COPY . .

# 暴露应用端口
EXPOSE  8080

# 启动服务（保持容器运行）
CMD  npm run dev

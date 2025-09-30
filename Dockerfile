
# 多阶段构建：给当前阶段命名为 builder 阶段
FROM node:20 AS builder

# 创建应用目录
WORKDIR /app

# 使用通配符确保复制 package.json 和 package-lock.json
# 先复制依赖清单，使仅依赖改变时，使依赖层缓存失效
COPY package*.json ./
# 复制 Prisma 模式文件目录
COPY prisma ./prisma/

# 安装应用依赖
RUN yarn install

# 复制项目源代码
COPY . .

# 生成 Prisma 客户端
RUN npx prisma generate
# 构建 NestJS 项目
RUN yarn build

FROM node:20 AS runner
# 运行阶段镜像

# 设置工作目录
WORKDIR /app

# 从构建阶段复制依赖与构建产物
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# 暴露服务端口
EXPOSE 3000
# 启动应用
CMD [ "node", "dist/main.js" ]
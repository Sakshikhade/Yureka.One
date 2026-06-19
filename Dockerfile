FROM node:20-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS build
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG GEMINI_API_KEY
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
RUN echo "GEMINI_API_KEY=${GEMINI_API_KEY}" > .env && \
    echo "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" >> .env && \
    echo "VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}" >> .env
RUN pnpm build

FROM node:20-alpine
RUN corepack enable && apk add --no-cache python3
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
COPY server.ts tsconfig.json ./
COPY scripts/ ./scripts/
EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "start"]

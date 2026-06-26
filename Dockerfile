FROM node:22-alpine AS deps
RUN npm install -g pnpm@9
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --config.allow-build=esbuild

FROM node:22-alpine AS build
RUN npm install -g pnpm@9
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# hadolint ignore=DL3025
ARG GEMINI_API_KEY
# hadolint ignore=DL3025
ARG VITE_SUPABASE_URL
# hadolint ignore=DL3025
ARG VITE_SUPABASE_ANON_KEY
RUN echo "GEMINI_API_KEY=${GEMINI_API_KEY}" > .env && \
    echo "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" >> .env && \
    echo "VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}" >> .env
RUN pnpm build

FROM node:22-alpine
RUN npm install -g pnpm@9 && apk add --no-cache python3
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --config.allow-build=esbuild
COPY --from=build /app/dist ./dist
COPY server.ts tsconfig.json ./
COPY scripts/ ./scripts/
EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "start"]

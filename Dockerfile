# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base

WORKDIR /app


#PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromiumTells Puppeteer where to find Chromium inside the container.

ENV NEXT_TELEMETRY_DISABLED=1 \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium ca-certificates \
    && rm -rf /var/lib/apt/lists/*

#this starts a new stage named dependencies.
FROM base AS dependencies

COPY package.json package-lock.json ./
RUN npm ci

#This starts the build stage.
FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Next.js currently reads pricing data during the build. BuildKit mounts these
# credentials temporarily: they are neither copied into the image nor its layers.
RUN --mount=type=secret,id=database_url \
    --mount=type=secret,id=direct_url \
    export DATABASE_URL="$(cat /run/secrets/database_url)" && \
    export DIRECT_URL="$(cat /run/secrets/direct_url)" && \
    export RESEND_API_KEY="build-only-placeholder" && \
    npx prisma generate && \
    npm run build

FROM base AS runner

ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# `output: "standalone"` is already enabled in next.config.ts.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Your templates are loaded dynamically at runtime with fs/readdirSync.
COPY --from=builder --chown=nextjs:nodejs /app/src/templates ./src/templates

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

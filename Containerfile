FROM docker.io/oven/bun AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev
RUN apt update && apt install -y python3 make g++
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

USER bun
ENTRYPOINT [ "bun", "start" ]

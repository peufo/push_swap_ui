FROM node
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
VOLUME [ "/app/node_modules", "/app/.svelte-kit" ]
RUN pnpm install
EXPOSE 5173
CMD ["pnpm", "dev", "--host"]
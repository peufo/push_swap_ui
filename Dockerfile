FROM node
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
EXPOSE 5173
CMD ["sleep", "infinity"]
# Build image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
    ARG RELEASE_VERSION=1.0.0.0
    RUN echo "Version: ${RELEASE_VERSION}"
    WORKDIR /app
    
    #Install Node
    RUN set -uex; \
        apt-get update; \
        apt-get install -y ca-certificates curl gnupg; \
        mkdir -p /etc/apt/keyrings; \
        curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
        NODE_MAJOR=20; \
        echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list; \
        apt-get update; \
        apt-get install nodejs -y;

    RUN npm install -g yarn
    COPY . ./
    RUN dotnet restore
    WORKDIR /app/Tetris
    RUN dotnet publish -c Release -o /app/out /property:Version=$RELEASE_VERSION

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
    WORKDIR /app
    COPY --from=build-env /app/out .

    # Install the agent
    RUN apt-get update && apt-get install -y wget ca-certificates gnupg \
    && echo 'deb http://apt.newrelic.com/debian/ newrelic non-free' | tee /etc/apt/sources.list.d/newrelic.list \
    && wget https://download.newrelic.com/548C16BF.gpg \
    && apt-key add 548C16BF.gpg \
    && apt-get update \
    && apt-get install -y newrelic-dotnet-agent \
    && rm -rf /var/lib/apt/lists/*

    # Enable the agent
    ARG NEWRELIC_KEY=''
    ENV CORECLR_ENABLE_PROFILING=1 \
    CORECLR_PROFILER={36032161-FFC0-4B61-B559-F6C5D41BAE5A} \
    CORECLR_NEWRELIC_HOME=/usr/local/newrelic-dotnet-agent \
    CORECLR_PROFILER_PATH=/usr/local/newrelic-dotnet-agent/libNewRelicProfiler.so \
    NEW_RELIC_LICENSE_KEY=${NEWRELIC_KEY} \
    NEW_RELIC_APP_NAME=tetris

    EXPOSE 80
    ENTRYPOINT ["dotnet", "Tetris.dll"]

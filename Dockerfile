FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
ARG RELEASE_VERSION=1.0.0.0
RUN echo "Version: ${RELEASE_VERSION}"
WORKDIR /app

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get install -y nodejs
RUN npm install -g yarn

# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -c Release -o out /property:Version=$RELEASE_VERSION

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .

# Configure the agent
ARG NEWRELIC_KEY=''
ENV CORECLR_ENABLE_PROFILING=1 \
CORECLR_PROFILER={36032161-FFC0-4B61-B559-F6C5D41BAE5A} \
CORECLR_NEWRELIC_HOME=/usr/local/newrelic-dotnet-agent \
CORECLR_PROFILER_PATH=/usr/local/newrelic-dotnet-agent/libNewRelicProfiler.so \
NEW_RELIC_LICENSE_KEY=${NEWRELIC_KEY} \
NEW_RELIC_APP_NAME=tetris

EXPOSE 80
ENTRYPOINT ["dotnet", "Tetris.dll"]

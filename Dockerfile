FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
ARG RELEASE_VERSION=1.0.0.0
ARG NEWRELIC_KEY=''
RUN echo "Version: ${RELEASE_VERSION}"
RUN echo "New Relic Key: ${NEWRELIC_KEY}"
WORKDIR /app

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - 
RUN apt-get install -y nodejs
RUN npm install -g yarn

# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -c Release -o out /property:Version=$RELEASE_VERSION

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0

# Install the agent
RUN apt-get update && apt-get install -y wget ca-certificates gnupg \
&& echo 'deb http://apt.newrelic.com/debian/ newrelic non-free' | tee /etc/apt/sources.list.d/newrelic.list \
&& wget https://download.newrelic.com/548C16BF.gpg \
&& apt-key add 548C16BF.gpg \
&& apt-get update \
&& apt-get install -y newrelic-netcore20-agent \
&& rm -rf /var/lib/apt/lists/*

# Enable the agent
ENV test=$NEWRELIC_KEY
ART test2=$NEWRELIC_KEY
RUN echo "test should be $NEWRELIC_KEY"
RUN echo "test: ${test}"
RUN echo "test2: ${test2}"

ENV CORECLR_ENABLE_PROFILING=1 \
CORECLR_PROFILER={36032161-FFC0-4B61-B559-F6C5D41BAE5A} \
CORECLR_NEWRELIC_HOME=/usr/local/newrelic-netcore20-agent \
CORECLR_PROFILER_PATH=/usr/local/newrelic-netcore20-agent/libNewRelicProfiler.so \
NEW_RELIC_LICENSE_KEY=$NEWRELIC_KEY \
NEW_RELIC_APP_NAME=tetris

WORKDIR /app
COPY --from=build-env /app/out .
EXPOSE 80
ENTRYPOINT ["dotnet", "Tetris.dll"]
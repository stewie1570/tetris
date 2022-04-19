FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app
# ARG RELEASE_VERSION=1.0.0
RUN echo "Release version: $RELEASE_VERSION"

# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - 
# RUN apt-get install -y nodejs
# RUN npm install -g yarn

# # Copy everything
# COPY . ./
# # Restore as distinct layers
# RUN dotnet restore
# # Build and publish a release
# RUN dotnet publish -c Release -o out

# # Build runtime image
# FROM mcr.microsoft.com/dotnet/aspnet:6.0
# WORKDIR /app
# COPY --from=build-env /app/out .
# EXPOSE 80
# ENTRYPOINT ["dotnet", "Tetris.dll"]
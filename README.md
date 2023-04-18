[![Build](https://github.com/stewie1570/tetris/actions/workflows/Merge.yml/badge.svg)](https://github.com/stewie1570/tetris/actions/workflows/Merge.yml)
[![Build (PR)](https://github.com/stewie1570/tetris/actions/workflows/PR.yml/badge.svg)](https://github.com/stewie1570/tetris/actions/workflows/PR.yml)
======

# A ReactJS SPA with a .NET WebApi/MVC backend

Hosted at:

- <https://stewie1570-tetris.fly.dev>
- <https://tetris-k2l9.onrender.com>
- <http://tetris.hopto.org>  (I'm self hosting this one for fun. It might be running)

## Docker Notes

Build the image:

```terminal
docker build -t tetris .
```

## Config Notes

- If you don't want an error when pausing & loading the score board or want to be able to post a score you'll need to provide a Redis connection string for the `RedisConnectionString` configuration key
- Other optional config keys include `SentryDsn` & `UseBackplane`

## Backend Design (dependency summary)
(via: https://github.com/stewie1570/DIGraph)

```mermaid
flowchart LR
  Tetris.Startup --> Microsoft.Extensions.Configuration.IConfiguration
  Tetris.Interactors.UserScoresInteractor --> Tetris.Domain.Interfaces.ILeaderBoardUpdater
  Tetris.Interactors.UserScoresInteractor --> System.Func`1
  Tetris.Hubs.GameHub --> Microsoft.Extensions.Logging.ILogger`1
  Tetris.Controllers.Api.UserScoresController --> Tetris.Interfaces.IUserScoresInteractor
  Tetris.Domain.LeaderBoard.LeaderBoardUpdater --> Tetris.Domain.Interfaces.ILeaderBoardStorage
  Tetris.Domain.LeaderBoard.LeaderBoardUpdater --> System.Func`1
  Tetris.Storage.RedisLeaderBoardProvider --> System.Threading.Tasks.Task`1
  Tetris.Storage.RedisLeaderBoardStorage --> System.Threading.Tasks.Task`1


    subgraph Microsoft.Extensions.Configuration.IConfiguration

    end


    subgraph Tetris.Domain.Interfaces.ILeaderBoardUpdater
        Tetris.Domain.LeaderBoard.LeaderBoardUpdater
    end


    subgraph System.Func`1

    end


    subgraph Microsoft.Extensions.Logging.ILogger`1

    end


    subgraph Tetris.Interfaces.IUserScoresInteractor
        Tetris.Interactors.UserScoresInteractor
    end


    subgraph Tetris.Domain.Interfaces.ILeaderBoardStorage
        Tetris.Storage.RedisLeaderBoardStorage
    end


    subgraph System.Threading.Tasks.Task`1

    end

```

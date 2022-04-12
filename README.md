[![Build](https://github.com/stewie1570/tetris/actions/workflows/Merge.yml/badge.svg)](https://github.com/stewie1570/tetris/actions/workflows/Merge.yml)
[![Build (PR)](https://github.com/stewie1570/tetris/actions/workflows/PR.yml/badge.svg)](https://github.com/stewie1570/tetris/actions/workflows/PR.yml)
======

A ReactJS SPA with a .NET WebApi/MVC backend.

Hosted at: https://dotnetcore-react-tetris.herokuapp.com/

*(Free plan, first request will be slow)*

**Docker Notes**

Build the image:
```terminal
docker build -t tetris .
```

**Config Notes**
- If you don't want an error when pausing & loading the score board or want to be able to post a score you'll need to provide a Redis connection string for the `RedisConnectionString` configuration key
- Other optional config keys include `SentryDsn` & `UseBackplane`

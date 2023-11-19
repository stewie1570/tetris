using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using StackExchange.Redis;
using Tetris.Domain.Interfaces;
using Tetris.Domain.LeaderBoard;
using Tetris.Domain.Models;
using Tetris.Hubs;
using Tetris.Interactors;
using Tetris.Interfaces;
using Tetris.Storage;
using Website.Middlewares;

namespace Tetris
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var signalR = services.AddSignalR();
            if (IsUsingBackplane())
            {
                signalR.AddStackExchangeRedis(Configuration["RedisConnectionString"]);
            }
            services.AddResponseCompression();
            services.AddControllersWithViews();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
            });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddScoped<ILeaderBoardStorage, RedisLeaderBoardStorage>();
            services.AddScoped<ILeaderBoardProvider, RedisLeaderBoardProvider>();
            services.AddScoped<ILeaderBoardUpdater, LeaderBoardUpdater>();
            services.AddScoped<Func<Task<LeaderBoard>>>(sp => sp.GetService<ILeaderBoardProvider>().GetLeaderBoard);
            services.AddScoped<IUserScoresInteractor, UserScoresInteractor>();
            services.AddSingleton(sp => ConnectionMultiplexer.ConnectAsync(Configuration["RedisConnectionString"]));
            services.AddSingleton<IMongoClient>(sp => Configuration["MongoConnectionString"] == null
                ? null
                : new MongoClient(Configuration["MongoConnectionString"]));
            services.AddSingleton<InMemoryGameRoomRepo>();
            services.AddScoped<MongoGameRoomRepo>();
            services.AddScoped<IGameRoomRepo>(sp =>
            {
                return sp.GetService<MongoClient>() == null
                    ? sp.GetService<InMemoryGameRoomRepo>()
                    : sp.GetService<MongoGameRoomRepo>();
            });
        }

        private bool IsUsingBackplane()
        {
            return Configuration["UseBackplane"]?.ToLower() == "true";
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseIPLogger();
            app.UseResponseCompression();
            app.UseRouting();
            app.UseCustomExceptionHandler(env, loggerFactory);
            if (GlobalConfig.IsSentryEnabled())
            {
                app.UseSentryTracing();
            }
            app.UseReverseProxyHttpsRedirect();
            app.UseNewRelicIgnore("/gameHub");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<GameHub>("/gameHub", options =>
                {
                    options.Transports = HttpTransportType.WebSockets;
                });
            });
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}

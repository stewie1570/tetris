[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Tetris.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(Tetris.App_Start.NinjectWebCommon), "Stop")]

namespace Tetris.App_Start
{
    using Domain.Interfaces;
    using Domain.LeaderBoard;
    using Domain.Models;
    using Interactors;
    using Interfaces;
    using Microsoft.Web.Infrastructure.DynamicModuleHelper;
    using Ninject;
    using Ninject.Web.Common;
    using System;
    using System.Threading.Tasks;
    using System.Web;
    using Storage;

    public static class NinjectWebCommon 
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start() 
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }
        
        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }
        
        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(kernel);

                // Web Api
                System.Web.Http.GlobalConfiguration.Configuration.DependencyResolver = new Ninject.Web.WebApi.NinjectDependencyResolver(kernel);

                // MVC 
                System.Web.Mvc.DependencyResolver.SetResolver(new Ninject.Web.Mvc.NinjectDependencyResolver(kernel));

                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<IRandonNumberGenerator>().To<RandomNumberGenerator>();
            kernel.Bind<IScoreBoardStorage>().To<InMemoryScoreBoard>();
            kernel.Bind<ILeaderBoardProvider>().ToMethod(ctx => new RandomizedLeaderBoardProvider(
                randomNumberGenerator: kernel.Get<IRandonNumberGenerator>(),
                config: new RandomUserProviderConfiguration { MinScore = 0, MaxScore = 120 },
                getNames: () => Task.FromResult(BotUsernames.Get())));
            kernel.Bind<ILeaderBoardUpdater>().To<LeaderBoardUpdater>();
            kernel
                .Bind<Task<LeaderBoard>>()
                .ToMethod(ctx => kernel.Get<ILeaderBoardProvider>().GetLeaderBoard())
                .InSingletonScope();
            kernel.Bind<IUserScoresInteractor>().To<UserScoresInteractor>();
        }        
    }
}

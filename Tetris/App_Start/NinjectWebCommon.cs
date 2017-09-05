[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Tetris.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(Tetris.App_Start.NinjectWebCommon), "Stop")]

namespace Tetris.App_Start
{
    using System;
    using System.Web;

    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;
    using Domain;
    using System.Collections.Generic;
    using Interfaces;
    using LeaderBoard;
    using System.Threading.Tasks;

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
            kernel.Bind<ILeaderBoardProvider>().ToMethod(ctx => new RandomizedLeaderBoardProvider(
                randomNumberGenerator: kernel.Get<IRandonNumberGenerator>(),
                config: new RandomUserProviderConfiguration { MinScore = 5, MaxScore = 200 },
                getNames: () => Task.FromResult(BotUsernames.Get())));
            kernel
                .Bind<Task<List<User>>>()
                .ToMethod(ctx => kernel.Get<ILeaderBoardProvider>().GetUsers())
                .InSingletonScope();
            kernel
                .Bind<Func<Task<List<User>>>>()
                .ToMethod(ctx => () => kernel.Get<Task<List<User>>>())
                .InSingletonScope();
        }        
    }
}

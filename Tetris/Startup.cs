using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Tetris.Startup))]
namespace Tetris
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

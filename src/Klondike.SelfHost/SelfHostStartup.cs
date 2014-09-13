using Autofac;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Formatters;
using Owin;

namespace Klondike.SelfHost
{
    class SelfHostStartup : Klondike.Startup
    {
        private readonly SelfHostSettings selfHostSettings;

        public SelfHostStartup(SelfHostSettings selfHostSettings)
        {
            this.selfHostSettings = selfHostSettings;
        }

        protected override string MapPath(string virtualPath)
        {
            return selfHostSettings.MapPath(virtualPath);
        }

        protected override INuGetWebApiSettings CreateSettings()
        {
            return selfHostSettings;
        }

        protected override NuGetHtmlMicrodataFormatter CreateMicrodataFormatter()
        {
            return new NuGetHtmlMicrodataFormatter();
        }

        protected override void Start(IAppBuilder app, IContainer container)
        {
            base.Start(app, container);

            var fileServerOptions = new FileServerOptions
            {
                FileSystem = new PhysicalFileSystem(selfHostSettings.BaseDirectory),
                EnableDefaultFiles = true,
            };
            fileServerOptions.DefaultFilesOptions.DefaultFileNames = new[] {"index.html"};
            app.UseFileServer(fileServerOptions);
        }
    }
}

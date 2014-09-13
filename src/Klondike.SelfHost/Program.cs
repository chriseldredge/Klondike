using System;
using System.IO;
using System.Linq;
using Autofac;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.Hosting;
using Microsoft.Owin.StaticFiles;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Formatters;
using Owin;
using System.Threading;

namespace Klondike.SelfHost
{
    class Program
    {
        internal static string BaseDirectory = ResolveBaseDirectory();

        private static string ResolveBaseDirectory()
        {
            var binPath = AppDomain.CurrentDomain.SetupInformation.ApplicationBase ?? Directory.GetCurrentDirectory();
            var index = binPath.LastIndexOf(Path.DirectorySeparatorChar + "bin", StringComparison.InvariantCultureIgnoreCase);
            if (index > 0)
            {
                binPath = binPath.Substring(0, index);
            }

            return binPath;
        }

        static void Main(string[] args)
        {
            int port;
            if (!int.TryParse(args.FirstOrDefault() ?? "8080", out port))
            {
                port = 8080;
            }

            var options = new StartOptions
            {
                ServerFactory = "Nowin",
                Port = port
            };

            var startup = new Startup();
            using (WebApp.Start(options, startup.Configuration))
            {
                Console.WriteLine("Base directory:" + BaseDirectory);

                //Under mono if you deamonize a process a Console.ReadLine will cause an EOF 
                //so we need to block another way
                if (args.Any(s => s.Equals("-d", StringComparison.CurrentCultureIgnoreCase)))
                {
                    Console.WriteLine("Running a http server on port {0}", port);
                    Thread.Sleep(Timeout.Infinite);
                }
                else
                {
                    Console.WriteLine("Running a http server on port {0}. Press enter to quit.", port);
                    Console.ReadKey();
                }
            }
            startup.WaitForShutdown(TimeSpan.FromSeconds(30));
        }

        internal static string MapPath(string virtualPath)
        {
            if (virtualPath.StartsWith("~/"))
            {
                virtualPath = virtualPath.Substring(2);
            }

            return Path.Combine(Program.BaseDirectory, virtualPath);

        }
    }

    class Startup : Klondike.Startup
    {
        protected override string MapPath(string virtualPath)
        {
            return Program.MapPath(virtualPath);
        }

        protected override INuGetWebApiSettings CreateSettings()
        {
            return new SelfHostSettings();
        }

        protected override NuGetHtmlMicrodataFormatter CreateMicrodataFormatter()
        {
            return new NuGetHtmlMicrodataFormatter();
        }

        protected override void Start(IAppBuilder app, IContainer container)
        {
            var fileServerOptions = new FileServerOptions
            {
                FileSystem = new PhysicalFileSystem(Program.BaseDirectory),
                EnableDefaultFiles = true,
            };
            fileServerOptions.DefaultFilesOptions.DefaultFileNames = new[] {"index.html"};
            app.UseFileServer(fileServerOptions);

            base.Start(app, container);
        }
    }

    class SelfHostSettings : NuGetWebApiSettings
    {
        protected override string MapPathFromAppSetting(string key, string defaultValue)
        {
            var path = GetAppSetting(key, defaultValue);

            return Program.MapPath(path);
        }
    }
}
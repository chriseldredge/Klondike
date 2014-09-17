using System;
using System.Linq;
using System.ServiceProcess;
using Common.Logging;
using Microsoft.Owin.Hosting;
using NuGet;

namespace Klondike.SelfHost
{
    class KlondikeService : ServiceBase
    {
        private static readonly ILog Log = LogManager.GetLogger<KlondikeService>();

        private readonly SelfHostSettings settings;
        private SelfHostStartup startup;
        private IDisposable server;

        public KlondikeService(SelfHostSettings settings)
        {
            this.settings = settings;
        }

        protected override void OnStart(string[] args)
        {
            base.OnStart(args);

            startup = new SelfHostStartup(settings);

            var options = new StartOptions();

            if (!string.IsNullOrWhiteSpace(settings.ServerFactory))
            {
                options.ServerFactory = settings.ServerFactory;
            };

            var urls = settings.Urls.ToArray();
            if (urls.Any())
            {
                options.Urls.AddRange(urls);
            }
            else
            {
                options.Port = settings.Port;
                urls = new[] {"http://*:" + options.Port + "/"};
            }

            server = WebApp.Start(options, startup.Configuration);

            Log.Info(m => m("Listening for HTTP requests on address(es): {0}", string.Join(", ", urls)));
        }

        protected override void OnStop()
        {
            Log.Info("Stopping HTTP server.");
            server.Dispose();
            Log.Info("Waiting for background tasks to complete.");
            while (!startup.WaitForShutdown(TimeSpan.FromSeconds(1)))
            {
                RequestAdditionalTime(milliseconds:2000);
            }
        }

        public void RunInteractivley()
        {
            OnStart(new string[0]);

            Console.WriteLine("Press <enter> to stop.");
            Console.ReadLine();

            OnStop();
        }
    }
}

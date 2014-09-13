using System;
using Microsoft.Owin.Hosting;

namespace Klondike.SelfHost
{
    class Program
    {
        static void Main(string[] args)
        {
            var settings = new SelfHostSettings(CommandLineSettings.Parse(args));
            var startup = new SelfHostStartup(settings);

            var options = new StartOptions
            {
                ServerFactory = "Nowin",
                Port = settings.Port
            };
            
            using (WebApp.Start(options, startup.Configuration))
            {
                Console.WriteLine("Running a http server on port {0}. Press enter to quit.", options.Port);
                Console.ReadLine();
            }
            startup.WaitForShutdown(TimeSpan.FromSeconds(30));
        }
    }
}

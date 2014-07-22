using System;
using System.Linq;
using Microsoft.Owin.Hosting;

namespace Klondike.SelfHost
{
    class Program
    {
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

            using (WebApp.Start<NuGet.Lucene.Web.Startup>(options))
            {
                Console.WriteLine("Running a http server on port {0}. Press enter to quit.", port);
                Console.ReadLine();
            }
        }
    }
}

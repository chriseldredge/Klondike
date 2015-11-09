using System;
using System.ServiceProcess;

namespace Klondike.SelfHost
{
    class Program
    {
        static Program()
        {
            // Make log4net use paths relative to application base.
            Environment.CurrentDirectory = AppDomain.CurrentDomain.SetupInformation.ApplicationBase;
        }

        static void Main(string[] args)
        {
            var settings = new SelfHostSettings(CommandLineSettings.Parse(args));

            var service = new KlondikeService(settings);

            if (settings.Interactive || Environment.UserInteractive)
            {
                Console.WriteLine("Running interactively");
                service.RunInteractivley();
            }
            else
            {
                Console.WriteLine("Running as service");
                ServiceBase.Run(service);
            }
        }
    }
}

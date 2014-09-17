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

            if (Environment.UserInteractive)
            {
                service.RunInteractivley();
            }
            else
            {
                ServiceBase.Run(service);
            }
        }
    }
}

using System;
using System.IO;
using NuGet.Lucene.Web;

namespace Klondike.SelfHost
{
    class SelfHostSettings : NuGetWebApiSettings
    {
        private readonly CommandLineSettings commandLineSettings;

        public SelfHostSettings(CommandLineSettings commandLineSettings)
            :base(prefix:"")
        {
            this.commandLineSettings = commandLineSettings;
        }

        protected override string GetAppSetting(string key, string defaultValue)
        {
            return commandLineSettings.GetValueOrDefault(key, base.GetAppSetting(key, defaultValue));
        }

        protected override string MapPathFromAppSetting(string key, string defaultValue)
        {
            return MapPath(GetAppSetting(key, defaultValue));
        }

        public int Port
        {
            get { return Convert.ToInt32(GetAppSetting("port", "8080")); }
        }

        public string BaseDirectory
        {
            get { return GetAppSetting("baseDirectory", DefaultBaseDirectory); }
        }

        public string MapPath(string path)
        {
            string virtualPath = path;
            if (virtualPath.StartsWith("~/"))
            {
                virtualPath = virtualPath.Substring(2);
            }

            return Path.Combine(BaseDirectory, virtualPath);
        }

        private static readonly string DefaultBaseDirectory = ResolveBaseDirectory();

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

    }
}
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
            if (string.Equals(key, "routePathPrefix", StringComparison.InvariantCultureIgnoreCase))
            {
                defaultValue = (VirtualPathRoot.TrimEnd('/') + '/' + defaultValue).TrimStart('/');
            }
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

        public IEnumerable<string> Urls
        {
            get
            {
                var urls = commandLineSettings.GetValues<string>("url").ToArray();
                if (urls.Any())
                {
                    return urls;
                }

                return base.GetAppSetting("url", "").Split(',').Select(s => s.Trim()).Where(s => !string.IsNullOrWhiteSpace(s));
            }
        }

        public string ServerFactory
        {
            get { return GetAppSetting("serverFactory", "Nowin"); }
        }

        public string BaseDirectory
        {
            get { return GetAppSetting("baseDirectory", DefaultBaseDirectory); }
        }

        public string VirtualPathRoot
        {
            get { return GetAppSetting("virtualPathRoot", "/"); }
        }

        public bool EnableIntegratedWindowsAuthentication
        {
            get { return GetFlagFromAppSetting("enableIntegratedWindowsAuthentication", false); }
        }

        public bool Interactive
        {
            get { return GetFlagFromAppSetting("interactive", false); }
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

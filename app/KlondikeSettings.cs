using System;
using System.IO;
using NuGet.Lucene.Web;

namespace Klondike
{
    public class KlondikeSettings : NuGetWebApiSettings
    {
        private readonly string applicationBase;

        public KlondikeSettings()
        {
            applicationBase = AppDomain.CurrentDomain.SetupInformation.ApplicationBase ?? Directory.GetCurrentDirectory();
        }

        protected override string MapPathFromAppSetting(string key, string defaultValue)
        {
            var path = GetAppSetting(key, defaultValue);

            if (path.StartsWith("~/"))
            {
                path = path.Replace("~/", "");
            }

            if (!Path.IsPathRooted(path))
            {
                path = Path.Combine(applicationBase, path);
            }
            return path;
        }
    }
}
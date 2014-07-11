using System;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using Microsoft.Framework.ConfigurationModel;
using NuGet.Lucene.Web;

namespace Klondike
{
    public class KlondikeSettings : NuGetWebApiSettings
    {
        private readonly string applicationBase;
        private static readonly IConfiguration config;
        private static readonly NameValueCollection roleMappings;

        static KlondikeSettings()
        {
            config = new Configuration().AddJsonFile("Settings.json");
            roleMappings = config.GetSubKeys("roleMappings").Aggregate(new NameValueCollection(), (c, kv) => { c[kv.Key] = kv.Value.Get(null); return c; });
        }

        public KlondikeSettings()
            : base("", new NameValueCollection(), roleMappings)
        {
            applicationBase = AppDomain.CurrentDomain.SetupInformation.ApplicationBase ?? Directory.GetCurrentDirectory();
        }

        protected override string GetAppSetting(string key, string defaultValue)
        {
            var value = config[key];
            return String.IsNullOrWhiteSpace(value) ? defaultValue : value;
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
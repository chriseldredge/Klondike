using System;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.Framework.ConfigurationModel;
using NuGet.Lucene.Web;

namespace Klondike
{
    public class KlondikeSettings : NuGetWebApiSettings
    {
        private static readonly IConfiguration config;
        private static readonly NameValueCollection roleMappings;
        private readonly IPathMappingHelper pathMappingHelper;

        static KlondikeSettings()
        {
            config = new Configuration(/* TODO: lol */ ".").AddJsonFile("Settings.json");
            roleMappings = config.GetSubKeys("roleMappings").Aggregate(new NameValueCollection(), (c, kv) => { c[kv.Key] = kv.Value.Get(null); return c; });
        }

        public KlondikeSettings(IPathMappingHelper pathMappingHelper)
            : base("", new NameValueCollection(), roleMappings)
        {
            this.pathMappingHelper = pathMappingHelper;
        }

        protected override string GetAppSetting(string key, string defaultValue)
        {
            var value = config[key];
            return String.IsNullOrWhiteSpace(value) ? defaultValue : value;
        }

        protected override string MapPathFromAppSetting(string key, string defaultValue)
        {
            var path = GetAppSetting(key, defaultValue);

            return pathMappingHelper.MapPath(path);
        }
    }
}
using Autofac;
using Owin;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Owin.Builder;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Formatters;

namespace Klondike
{
    using AppFunc = Func<IDictionary<string, object>, Task>;

    using BuildFunc = Action<Func<Func<IDictionary<string, object>, Task>,
                                  Func<IDictionary<string, object>, Task>>>;

    public class Startup : NuGet.Lucene.Web.Startup
    {
        public void Configure(IBuilder app)
        {
            app.UseStaticFiles();

            var appBuilder = new AppBuilder();
            Configuration(appBuilder);
            AppFunc appFunc = (AppFunc)appBuilder.Build(typeof(AppFunc));

            BuildFunc buildFunc = app.UseOwin();
            buildFunc(next => appFunc.Invoke);
        }

        protected override INuGetWebApiSettings CreateSettings()
        {
            return new KlondikeSettings();
        }

        protected override void RegisterServices(IContainer container, IAppBuilder app, HttpConfiguration config)
        {
            base.RegisterServices(container, app, config);
            config.Routes.MapHttpRoute("Version", "api/version", new { controller = "Meta" });
        }

        protected override NuGetHtmlMicrodataFormatter CreateMicrodataFormatter()
        {
            var formatter = new KlondikeHtmlMicrodataFormatter();

            formatter.SupportedMediaTypes.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            formatter.SupportedMediaTypes.Add(new MediaTypeWithQualityHeaderValue("text/xml"));

            formatter.Settings.Indent = true;

            formatter.Title = "Klondike API";
            /*
            formatter.AddHeadContent(
                new XElement("script",
                    new XAttribute("src", VirtualPathUtility.ToAbsolute("~/js/formtemplate.min.js")),
                    new XText("")));
            */
            return formatter;
        }

        class KlondikeSettings : NuGetWebApiSettings
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
}

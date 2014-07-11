using Autofac;
using Klondike.Extensions;
using Microsoft.AspNet.Builder;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Formatters;
using Owin;
using System;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Klondike
{
    public class Startup : NuGet.Lucene.Web.Startup
    {
        public void Configure(IBuilder app)
        {
            app.Use(next => async context =>
                {
                // request is incoming
                Console.WriteLine(string.Format(
                        "{0} {1}{2}",
                        context.Request.Method,
                        context.Request.PathBase,
                        context.Request.Path));

                // pass control to following components
                await next(context);
                });

            app.UseStaticFiles();

            app.UseOwinAppBuilder(Configuration);
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

        
    }
}
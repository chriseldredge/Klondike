using Autofac;
using Common.Logging;
using Common.Logging.Configuration;
using Common.Logging.Simple;
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
            // create properties
            var properties = new NameValueCollection();
            properties["showDateTime"] = "true";

            // set Adapter
            LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter(properties) { Level = LogLevel.Info };

            var requestLog = LogManager.GetLogger("RequestLog");

            app.Use(next => async context =>
                {
                    await next(context);

                    requestLog.Info(m => m("{0} {1}{2} {3}",
                        context.Request.Method,
                        context.Request.PathBase,
                        context.Request.Path,
                        context.Response.StatusCode));
                });

            app.UseStaticFiles();

            app.UseOwinAppBuilder(Configuration);
        }

        protected override INuGetWebApiSettings CreateSettings()
        {
            return new KlondikeSettings();
        }

        protected virtual bool IsRunningOnMono
        {
            get
            {
                return Type.GetType("Mono.Runtime") != null;
            }
        }

        protected override void RegisterServices(IContainer container, IAppBuilder app, HttpConfiguration config)
        {
            if (IsRunningOnMono)
            {
                var apiMapper = container.Resolve<NuGetWebApiRouteMapper>();

                config.Routes.MapHttpRoute("Mono Hard-Coded OData Workspace Handler", apiMapper.ODataRoutePath,
                    new object(),
                    new object(),
                    new MonoHardCodedODataWorkspaceHandler());
            }

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
                    new XAttribute("src", MapPath("~/js/formtemplate.min.js")),
                    new XText("")));
            */
            return formatter;
        }
    }
}

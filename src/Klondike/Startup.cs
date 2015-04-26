using Autofac;
using Common.Logging;
using Common.Logging.Configuration;
using Common.Logging.Simple;
using Klondike.Extensions;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Framework.DependencyInjection;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Formatters;
using Owin;
using System;
using System.Web.Http;

namespace Klondike
{
    public class Startup : NuGet.Lucene.Web.Startup
    {
        private IPathMappingHelper pathMappingHelper;
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IPathMappingHelper, PathMappingHelper>();
        }

        public void Configure(IApplicationBuilder app)
        {
            // create properties
            var properties = new NameValueCollection();
            properties["showDateTime"] = "true";

            // set Adapter
            LogManager.Adapter = new ConsoleOutLoggerFactoryAdapter(properties) { Level = LogLevel.Info };

            pathMappingHelper = (IPathMappingHelper)app.ApplicationServices.GetService(typeof(IPathMappingHelper));

            if (CreateSettings().ShowExceptionDetails)
            {
                app.UseErrorPage(ErrorPageOptions.ShowAll);
            }

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

            app.UseSendFileFallback();

            app.UseMiddleware<StaticFileFallbackMiddleware>(new StaticFileFallbackOptions
            {
                File = "index.html",
                BlacklistedPaths = new[]
                {
                    new PathString("/api"),
                    new PathString("/assets")
                }
            });

            app.UseStaticFiles();

            app.UseOwinAppBuilder(Configuration);
        }

        protected override INuGetWebApiSettings CreateSettings()
        {
            return new KlondikeSettings(pathMappingHelper);
        }

        protected virtual bool IsRunningOnMono
        {
            get
            {
                return Type.GetType("Mono.Runtime") != null;
            }
        }

        /// <summary>
        /// See https://bugzilla.xamarin.com/show_bug.cgi?id=21571
        /// </summary>
        protected virtual bool MonoCantEven
        {
            get
            {
                try
                {
                    new Uri("/example", UriKind.Relative).GetComponents(UriComponents.SerializationInfoString, UriFormat.UriEscaped);
                    return false;
                }
                catch (InvalidOperationException)
                {
                    return true;
                }
            }
        }

        protected override void RegisterServices(IContainer container, IAppBuilder app, HttpConfiguration config)
        {
            var apiMapper = container.Resolve<NuGetWebApiRouteMapper>();

            if (IsRunningOnMono && MonoCantEven)
            {
                LogManager.GetLogger<Startup>().Info("Using mono compatibility shim for OData.");
                config.Routes.MapHttpRoute("Mono Hard-Coded OData Workspace Handler",
                    apiMapper.ODataRoutePath,
                    new object(),
                    new object(),
                    new MonoHardCodedODataWorkspaceHandler());
            }

            base.RegisterServices(container, app, config);
            config.Routes.MapHttpRoute("Version", apiMapper.PathPrefix + "version", new { controller = "Meta" });
        }

        protected override NuGetHtmlMicrodataFormatter CreateMicrodataFormatter()
        {
            return new KlondikeHtmlMicrodataFormatter(pathMappingHelper);
        }
    }
}

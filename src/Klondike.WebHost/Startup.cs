using System;
using System.Web.Http;
using Autofac;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Formatters;
using Owin;
using Microsoft.Owin;

namespace Klondike
{
    public class Startup : NuGet.Lucene.Web.Startup
    {
        IContainer container;

        protected override INuGetWebApiSettings CreateSettings()
        {
            return new NuGetWebApiWebHostSettings(prefix: "");
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

        protected override void Start(IAppBuilder app, IContainer container)
        {
            var pathUtility = container.Resolve<IVirtualPathUtility>();
            app.UseFallbackFile(pathUtility.MapPath("~/index.html"), new PathString("/api"), new PathString("/assets"));

            base.Start(app, container);
        }

        protected override HttpConfiguration CreateHttpConfiguration()
        {
            return new HttpConfiguration(new HttpRouteCollection(GlobalConfiguration.Configuration.VirtualPathRoot));
        }

        protected override IContainer CreateContainer(IAppBuilder app)
        {
            var builder = new ContainerBuilder();
            builder.RegisterType<WebHostVirtualPathUtility>().As<IVirtualPathUtility>();
            builder.RegisterType<KlondikeHtmlMicrodataFormatter>().As<NuGetHtmlMicrodataFormatter>();
            container = base.CreateContainer(app);
            builder.Update(container);
            return container;
        }

        protected override void RegisterServices(IContainer container, IAppBuilder app, HttpConfiguration config)
        {
            var apiMapper = container.Resolve<NuGetWebApiRouteMapper>();

            if (IsRunningOnMono && MonoCantEven)
            {
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
            return container.Resolve<NuGetHtmlMicrodataFormatter>();
        }
    }
}

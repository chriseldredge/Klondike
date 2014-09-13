using System;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Xml.Linq;
using Autofac;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Formatters;
using Owin;

namespace Klondike
{
    public class Startup : NuGet.Lucene.Web.Startup
    {
        protected override INuGetWebApiSettings CreateSettings()
        {
            return new NuGetWebApiWebHostSettings(prefix:"");
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

            formatter.AddHeadContent(
                new XElement("script",
                    new XAttribute("src", MapPath("~/js/formtemplate.min.js")),
                    new XText("")));

            return formatter;
        }

        protected virtual string MapPath(string virtualPath)
        {
            return VirtualPathUtility.ToAbsolute(virtualPath);
        }
    }
}

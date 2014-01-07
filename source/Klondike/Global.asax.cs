using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Routing;
using System.Xml.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Filters;
using NuGet.Lucene.Web.Formatters;
using NuGet.Lucene.Web.MessageHandlers;
using AspNet.WebApi.HtmlMicrodataFormatter;

namespace Klondike
{
    public class Global : HttpApplication
    {
        public static NuGetWebApiRouteMapper RouteMapper { get; set; }

        protected void Application_Start(object sender, EventArgs e)
        {
            TaskScheduler.UnobservedTaskException +=
                (_, ex) => UnhandledExceptionLogger.LogException(ex.Exception,
                    string.Format("Unobserved exception in async task: {0}", ex.Exception.Message));

            ConfigureWebApi(GlobalConfiguration.Configuration);

            RouteMapper.MapApiRoutes(GlobalConfiguration.Configuration);
            RouteMapper.MapDataServiceRoutes(RouteTable.Routes);
        }

        public static void ConfigureWebApi(HttpConfiguration config)
        {
            config.IncludeErrorDetailPolicy = NuGetWebApiModule.ShowExceptionDetails
                                                  ? IncludeErrorDetailPolicy.Always
                                                  : IncludeErrorDetailPolicy.Default;

            config.MessageHandlers.Add(new CrossOriginMessageHandler(NuGetWebApiModule.EnableCrossDomainRequests));
            config.Filters.Add(new ExceptionLoggingFilter());

            var documentation = new HtmlDocumentation();
            documentation.Load();
            config.Services.Replace(typeof(IDocumentationProvider), new WebApiHtmlDocumentationProvider(documentation));

            config.Formatters.Add(CreateHtmlFormatter());
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.Formatters.Add(new PackageFormDataMediaFormatter());
            
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new StringEnumConverter());
            config.Formatters.JsonFormatter.SerializerSettings.Formatting = Formatting.Indented;
        }

        private static HtmlMicrodataFormatter CreateHtmlFormatter()
        {
            var formatter = new KlondikeHtmlMicrodataFormatter();

            formatter.SupportedMediaTypes.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            formatter.SupportedMediaTypes.Add(new MediaTypeWithQualityHeaderValue("text/xml"));

            formatter.Settings.Indent = true;

            formatter.Title = "Klondike API";

            formatter.AddHeadContent(
                new XElement("script",
                    new XAttribute("src", VirtualPathUtility.ToAbsolute("~/js/formtemplate.min.js")),
                    new XText("")));

            return formatter;
        }
    }

    public class KlondikeHtmlMicrodataFormatter : NuGetHtmlMicrodataFormatter
    {
        private Lazy<string> cssFilename = new Lazy<string>(FindSylesheet);

        private static string FindSylesheet()
        {
            const string stylePath = "~/styles/";
            var cssDir = HostingEnvironment.MapPath(stylePath);
            var file = Path.GetFileName(Directory.GetFiles(cssDir, "*.css").First());
            return VirtualPathUtility.ToAbsolute(stylePath + file);
        }

        public override IEnumerable<XObject> BuildHeadElements(object value, HttpRequestMessage request)
        {
            var cssLink = new XElement("link",
                new XAttribute("rel", "stylesheet"),
                new XAttribute("href", cssFilename.Value));

            return base.BuildHeadElements(value, request).Union(new [] {cssLink});
        }
    }
}
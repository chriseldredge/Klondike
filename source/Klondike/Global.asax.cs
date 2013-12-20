using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
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
        public override IEnumerable<XObject> BuildHeadElements(object value, HttpRequestMessage request)
        {
            //var styles = Styles.Render("~/css/bundle.css");
            //var links = XElement.Parse("<n>" + styles.ToHtmlString() + "</n>").Nodes();
            return base.BuildHeadElements(value, request);//.Union(links);
        }
    }
}
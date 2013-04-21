using System;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Filters;
using NuGet.Lucene.Web.Formatters;
using NuGet.Lucene.Web.MessageHandlers;

namespace NuStache
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
            RouteMapper.MapHubs(RouteTable.Routes);
        }

        public static void ConfigureWebApi(HttpConfiguration config)
        {
            config.IncludeErrorDetailPolicy = NuGetWebApiModule.ShowExceptionDetails
                                                  ? IncludeErrorDetailPolicy.Always
                                                  : IncludeErrorDetailPolicy.Default;

            config.MessageHandlers.Add(new CrossOriginMessageHandler(NuGetWebApiModule.EnableCrossDomainRequests));
            config.Filters.Add(new ExceptionLoggingFilter());
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.Formatters.Add(new PackageFormDataMediaFormatter());
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new StringEnumConverter());
            config.Formatters.JsonFormatter.SerializerSettings.Formatting = Formatting.Indented;
        }
    }
}
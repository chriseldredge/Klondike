using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using Microsoft.Owin.Builder;
using Owin;

namespace Klondike.Extensions
{
    using Microsoft.AspNet.Hosting;
    using Microsoft.Owin.BuilderProperties;
    using AppFunc = Func<IDictionary<string, object>, Task>;

    using BuildFunc = Action<Func<Func<IDictionary<string, object>, Task>,
                                  Func<IDictionary<string, object>, Task>>>;

    public static class OwinAppBuilderAdapterExtensions
    {
        public static void UseOwinAppBuilder(this IApplicationBuilder builder, Action<IAppBuilder> action)
        {
            var appBuilder = new AppBuilder();
            var applicationLifetime = (IApplicationLifetime) builder.ApplicationServices.GetService(typeof(IApplicationLifetime));
            var appProperties = new AppProperties(appBuilder.Properties);
            appProperties.AppName = builder.Server.Name;
            appProperties.OnAppDisposing = applicationLifetime.ApplicationStopping;

            action(appBuilder);

            AppFunc appFunc = (AppFunc)appBuilder.Build(typeof(AppFunc));

            BuildFunc buildFunc = builder.UseOwin();
            buildFunc(next => appFunc.Invoke);
        }
    }
}
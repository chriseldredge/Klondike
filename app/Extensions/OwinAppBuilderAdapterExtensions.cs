using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.Owin.Builder;
using Owin;

namespace Klondike.Extensions
{
    using AppFunc = Func<IDictionary<string, object>, Task>;

    using BuildFunc = Action<Func<Func<IDictionary<string, object>, Task>,
                                  Func<IDictionary<string, object>, Task>>>;

    public static class OwinAppBuilderAdapterExtensions
    {
        public static void UseOwinAppBuilder(this IBuilder builder, Action<IAppBuilder> action)
        {
            var appBuilder = new AppBuilder();

            action(appBuilder);

            AppFunc appFunc = (AppFunc)appBuilder.Build(typeof(AppFunc));

            BuildFunc buildFunc = builder.UseOwin();
            buildFunc(next => appFunc.Invoke);
        }
    }
}
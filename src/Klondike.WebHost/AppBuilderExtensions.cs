using System.Linq;
using Microsoft.Owin;
using Owin;

namespace Klondike
{
    public static class AppBuilderExtensions
    {
        /// <summary>
        /// Sends a static content file for any request that would otherwise result in a 404.
        /// </summary>
        /// <param name="appBuilder"></param>
        /// <param name="fallbackFile"></param>
        /// <param name="blacklistPathStrings">Optional list of path strings that should suppress this behavior.</param>
        /// <returns></returns>
        public static IAppBuilder UseFallbackFile(this IAppBuilder appBuilder, string fallbackFile, params PathString[] blacklistPathStrings)
        {
            return appBuilder.Use(async (ctx, next) =>
            {
                await next();

                var path = ctx.Request.Path;

                if (ctx.Response.StatusCode != 404 || blacklistPathStrings.Any(path.StartsWithSegments))
                {
                    return;
                }

                ctx.Response.StatusCode = 200;

                await ctx.Response.SendFileAsync(fallbackFile);
            });
        }
    }
}

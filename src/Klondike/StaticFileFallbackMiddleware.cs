using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Framework.Runtime;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Klondike
{
    public class StaticFileFallbackOptions
    {
        public string File { get; set; }
        public IEnumerable<PathString> BlacklistedPaths { get; set; }

        public StaticFileFallbackOptions()
        {
            BlacklistedPaths = new PathString[0];
        }
    }

    public class StaticFileFallbackMiddleware
    {
        private readonly RequestDelegate next;
        private readonly IApplicationEnvironment applicationEnvironment;
        private readonly StaticFileFallbackOptions options;

        public StaticFileFallbackMiddleware(RequestDelegate next, IApplicationEnvironment applicationEnvironment, StaticFileFallbackOptions options)
        {
            this.next = next;
            this.applicationEnvironment = applicationEnvironment;
            this.options = options;
        }

        public async Task Invoke(HttpContext context)
        {
            await next(context);

            var path = context.Request.Path;

            if (context.Response.StatusCode != 404 || options.BlacklistedPaths.Any(path.StartsWithSegments))
            {
                return;
            }

            context.Response.StatusCode = 200;
            var filePath = Path.Combine(applicationEnvironment.ApplicationBasePath, options.File);
            await context.Response.SendFileAsync(filePath);
        }
    }
}

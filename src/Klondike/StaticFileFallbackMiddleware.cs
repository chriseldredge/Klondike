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
        private readonly IPathMappingHelper pathMappingHelper;
        private readonly StaticFileFallbackOptions options;

        public StaticFileFallbackMiddleware(RequestDelegate next, IPathMappingHelper pathMappingHelper, StaticFileFallbackOptions options)
        {
            this.next = next;
            this.pathMappingHelper = pathMappingHelper;
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

            var filePath = pathMappingHelper.MapPath(options.File);
            if (!File.Exists(filePath))
            {
                return;
            }

            context.Response.StatusCode = 200;
            await context.Response.SendFileAsync(filePath);
        }
    }
}

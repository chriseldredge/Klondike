using Microsoft.Framework.Runtime;
using System.IO;

namespace Klondike
{
    public interface IPathMappingHelper
    {
        string MapPath(string virtualPath);
        string ToAbsolute(string virtualPath);
    }

    public class PathMappingHelper : IPathMappingHelper
    {
        private readonly IApplicationEnvironment applicationEnvironment;

        public PathMappingHelper(IApplicationEnvironment applicationEnvironment)
        {
            this.applicationEnvironment = applicationEnvironment;
        }

        public string MapPath(string virtualPath)
        {
            if (virtualPath.StartsWith("~/"))
            {
                virtualPath = virtualPath.Substring(2);
            }

            return Path.Combine(applicationEnvironment.ApplicationBasePath, virtualPath);
        }

        public string ToAbsolute(string virtualPath)
        {
            if (virtualPath.StartsWith("~/"))
            {
                virtualPath = virtualPath.Substring(2);
            }

            // TODO: lol
            return "/" + virtualPath.TrimStart('/');
        }
    }
}
using System;
using System.IO;
using System.Net;
using Autofac;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Formatters;
using Owin;

namespace Klondike.SelfHost
{
    public class SelfHostVirtualPathUtility : IVirtualPathUtility
    {
        readonly string virtualPathRoot;
        readonly string webRoot;

        public SelfHostVirtualPathUtility(string webRoot, string virtualPathRoot)
        {
            if (string.IsNullOrEmpty(webRoot))
            {
                throw new ArgumentException("webRoot must not be null or blank", "webRoot");
            }
            if (!Path.IsPathRooted(webRoot))
            {
                throw new ArgumentException("webRoot must be an absolute path", "webRoot");
            }
            if (!Directory.Exists(webRoot))
            {
                throw new ArgumentException("Directory does not exist", "webRoot");
            }

            if (virtualPathRoot == null)
            {
                virtualPathRoot = "";
            }

            if (virtualPathRoot.Length > 0 && !virtualPathRoot.StartsWith("/"))
            {
                throw new ArgumentException("virtualPathRoot must be blank or start with /", "virtualPathRoot");
            }

            this.webRoot = webRoot.TrimEnd('\\', '/');
            this.virtualPathRoot = virtualPathRoot.TrimEnd('\\', '/');
        }

        public string MapPath(string virtualPath)
        {
            if (virtualPath.StartsWith("~/"))
            {
                virtualPath = virtualPath.Substring(1).TrimStart('/');
            }

            return Path.Combine(webRoot, virtualPath);
        }

        public string ToAbsolute(string virtualPath)
        {
            var physicalPath = MapPath(virtualPath);

            if (!physicalPath.StartsWith(webRoot))
            {
                throw new InvalidOperationException("Path is not rooted in document root");
            }

            var relativePath = physicalPath.Substring(webRoot.Length);

            return virtualPathRoot + relativePath.Replace('\\', '/');
        }
    }
}

using System;
using System.Web;
using System.Web.Http;
using System.Xml.Linq;
using Autofac;
using NuGet.Lucene.Web;
using NuGet.Lucene.Web.Formatters;
using Owin;
using Microsoft.Owin;
using System.Web.Hosting;

namespace Klondike
{
    public interface IVirtualPathUtility
    {
        /// <summary>
        /// Converts a virtual path to a physical file system path.
        /// </summary>
        string MapPath(string virtualPath);

        /// <summary>
        /// Converts an app-relative path (e.g. <c>~/index.html</c>
        /// to an absolute URI path (e.g. <c>/myApp/index.html</c>).
        /// </summary>
        string ToAbsolute(string virtualPath);
    }

    public class WebHostVirtualPathUtility : IVirtualPathUtility
    {
        public string MapPath(string virtualPath)
        {
            return HostingEnvironment.MapPath(virtualPath);
        }

        public string ToAbsolute(string virtualPath)
        {
            return VirtualPathUtility.ToAbsolute(virtualPath);
        }
    }
}

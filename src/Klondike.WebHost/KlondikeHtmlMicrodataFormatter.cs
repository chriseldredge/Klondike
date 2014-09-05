using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Hosting;
using System.Xml.Linq;
using NuGet.Lucene.Web.Formatters;

namespace Klondike
{
    public class KlondikeHtmlMicrodataFormatter : NuGetHtmlMicrodataFormatter
    {
        private readonly Lazy<IList<string>> _css = new Lazy<IList<string>>(FindSylesheet);

        private static List<string> FindSylesheet()
        {
            const string stylePath = "~/assets/";
            var cssDir = HostingEnvironment.MapPath(stylePath);
            var vendorCss = Directory.GetFiles(cssDir, "vendor*.css").FirstOrDefault();
            var appCss = Directory.GetFiles(cssDir, "klondike*.css").FirstOrDefault();
            return new[] {vendorCss, appCss}
                .Where(i => i != null)
                .Select(i => VirtualPathUtility.ToAbsolute(stylePath + Path.GetFileName(i)))
                .ToList();
        }

        public override IEnumerable<XObject> BuildHeadElements(object value, HttpRequestMessage request)
        {
            var headElements = base.BuildHeadElements(value, request);

            var cssLinks = _css.Value.Select(
                i => new XElement("link",
                        new XAttribute("rel", "stylesheet"),
                        new XAttribute("href", i)));

            return headElements.Union(cssLinks);
        }
    }
}
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
        private readonly Lazy<string> _cssFilename = new Lazy<string>(FindSylesheet);

        private static string FindSylesheet()
        {
            const string stylePath = "~/styles/";
            var cssDir = HostingEnvironment.MapPath(stylePath);
            var file = Path.GetFileName(Directory.GetFiles(cssDir, "*.css").First());
            return VirtualPathUtility.ToAbsolute(stylePath + file);
        }

        public override IEnumerable<XObject> BuildHeadElements(object value, HttpRequestMessage request)
        {
            var cssLink = new XElement("link",
                new XAttribute("rel", "stylesheet"),
                new XAttribute("href", _cssFilename.Value));

            return base.BuildHeadElements(value, request).Union(new [] {cssLink});
        }
    }
}
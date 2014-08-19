using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Xml.Linq;
using NuGet.Lucene.Web.Formatters;

namespace Klondike
{
    public class KlondikeHtmlMicrodataFormatter : NuGetHtmlMicrodataFormatter
    {
        /*
        private readonly Lazy<string> _cssFilename = new Lazy<string>(FindSylesheet);

        private static string FindSylesheet()
        {
            const string stylePath = "~/styles/";
            var cssDir = HostingEnvironment.MapPath(stylePath);
            var first = Directory.GetFiles(cssDir, "*.css").FirstOrDefault();
            if (first == null) return null;
            var file = Path.GetFileName(first);
            return VirtualPathUtility.ToAbsolute(stylePath + file);
        }

        public override IEnumerable<XObject> BuildHeadElements(object value, HttpRequestMessage request)
        {
            var headElements = base.BuildHeadElements(value, request);

            if (_cssFilename.Value == null) return headElements;
            
            var cssLink = new XElement("link",
                new XAttribute("rel", "stylesheet"),
                new XAttribute("href", _cssFilename.Value));

            return headElements.Union(new [] {cssLink});
        }
        */
    }
}
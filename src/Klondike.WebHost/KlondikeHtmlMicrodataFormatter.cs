using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Hosting;
using System.Xml.Linq;
using NuGet.Lucene.Web.Formatters;

namespace Klondike
{
    public class KlondikeHtmlMicrodataFormatter : NuGetHtmlMicrodataFormatter
    {
        readonly Lazy<IEnumerable<string>> cssLazy;
        readonly IVirtualPathUtility virtualPathUtility;

        public KlondikeHtmlMicrodataFormatter(IVirtualPathUtility virtualPathUtility)
        {
            SupportedMediaTypes.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            SupportedMediaTypes.Add(new MediaTypeWithQualityHeaderValue("text/xml"));

            Settings.Indent = true;

            Title = "Klondike API";

            cssLazy = new Lazy<IEnumerable<string>>(FindSylesheets);
            this.virtualPathUtility = virtualPathUtility;
        }

        public override IEnumerable<XObject> BuildHeadElements(object value, HttpRequestMessage request)
        {
            var headElements = base.BuildHeadElements(value, request);

            var cssLinks = cssLazy.Value.Select(
                i => new XElement("link",
                        new XAttribute("rel", "stylesheet"),
                        new XAttribute("href", i)));

            var scripts = new[]
            {
                new XElement("script",
                    new XAttribute("src", virtualPathUtility.ToAbsolute("~/js/formtemplate.min.js")),
                    new XText(""))
            };

            return headElements.Union(cssLinks).Union(scripts);
        }

        private IEnumerable<string> FindSylesheets()
        {
            const string stylePath = "~/assets/";
            var cssDir = virtualPathUtility.MapPath(stylePath);

            if (!Directory.Exists(cssDir))
            {
                return new string[0];
            }

            var vendorCss = Directory.GetFiles(cssDir, "vendor*.css").FirstOrDefault();
            var appCss = Directory.GetFiles(cssDir, "klondike*.css").FirstOrDefault();
            return new[] {vendorCss, appCss}
                .Where(i => i != null)
                .Select(i => virtualPathUtility.ToAbsolute(stylePath + Path.GetFileName(i)))
                .ToList();
        }
    }
}

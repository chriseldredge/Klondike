using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Xml.Linq;
using NuGet.Lucene.Web.Formatters;
using System.Net.Http.Headers;

namespace Klondike
{
    public class KlondikeHtmlMicrodataFormatter : NuGetHtmlMicrodataFormatter
    {
        private IPathMappingHelper pathMappingHelper;

        private readonly Lazy<IEnumerable<string>> _css;
        
        private IEnumerable<string> FindSylesheets()
        {
            const string stylePath = "~/assets/";
            var cssDir = pathMappingHelper.MapPath(stylePath);
            if (!Directory.Exists(cssDir))
            {
                return new string[0];
            }

            var vendorCss = Directory.GetFiles(cssDir, "vendor*.css").FirstOrDefault();
            var appCss = Directory.GetFiles(cssDir, "klondike*.css").FirstOrDefault();
            return new[] {vendorCss, appCss}
                .Where(i => i != null)
                .Select(i => pathMappingHelper.ToAbsolute(stylePath + Path.GetFileName(i)))
                .ToList();
        }

        public KlondikeHtmlMicrodataFormatter(IPathMappingHelper pathMappingHelper)
        {
            this.pathMappingHelper = pathMappingHelper;
            this._css = new Lazy<IEnumerable<string>>(FindSylesheets);

            SupportedMediaTypes.Add(new MediaTypeWithQualityHeaderValue("application/xml"));
            SupportedMediaTypes.Add(new MediaTypeWithQualityHeaderValue("text/xml"));

            Settings.Indent = true;

            Title = "Klondike API";
        }

        public override IEnumerable<XObject> BuildHeadElements(object value, HttpRequestMessage request)
        {
            var headElements = base.BuildHeadElements(value, request);

            var cssLinks = _css.Value.Select(
                i => new XElement("link",
                        new XAttribute("rel", "stylesheet"),
                        new XAttribute("href", i)));

            var scripts = new[] {
                new XElement("script",
                    new XAttribute("src", pathMappingHelper.ToAbsolute("~/js/formtemplate.min.js")),
                    new XText(""))
            };

            return headElements.Union(cssLinks).Union(scripts);
        }
    }
}

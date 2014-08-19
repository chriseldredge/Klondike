using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Klondike
{
    /// <summary>
    /// See http://social.msdn.microsoft.com/Forums/en-US/2efaaba5-92cb-4ad4-97da-1216d495a295/bug-uriutilsensureescapedrelativeuri-fails-on-mono
    /// </summary>
    public class MonoHardCodedODataWorkspaceHandler : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            const string template = @"<?xml version=""1.0"" encoding=""utf-8""?>
<service xml:base=""{0}"" xmlns=""http://www.w3.org/2007/app"" xmlns:atom=""http://www.w3.org/2005/Atom"">
  <workspace>
    <atom:title type=""text"">Default</atom:title>
    <collection href=""Packages"">
      <atom:title type=""text"">Packages</atom:title>
    </collection>
  </workspace>
</service>";

            var xmlBase = request.RequestUri.ToString();
            if (!xmlBase.EndsWith("/"))
            {
                xmlBase += "/";
            }

            var body = string.Format(template, xmlBase);

            var msg = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(body, Encoding.UTF8, "application/xml")
            };

            return Task.FromResult(msg);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using Lucene.Net.Linq;
using Lucene.Net.Search;
using NuGet;
using NuGet.Lucene;

namespace Klondike
{
    /// <summary>
    /// Metadata about Klondike.
    /// </summary>
    public class MetaController : ApiController
    {
        private static readonly ISet<Type> Types = new HashSet<Type>
        {
            typeof(MetaController),
            typeof(LucenePackage),
            typeof(IPackage),
            typeof(LuceneDataProvider),
            typeof(IndexSearcher)
        };

        /// <summary>
        /// Gets version information for components of Klondike.
        /// </summary>
        public IDictionary<string, string> GetComponentVersions()
        {
            return Types.Select(t => t.Assembly).ToDictionary(
                a => a.GetName().Name,
                a => a.GetName().Version.ToString());
        }
    }
}
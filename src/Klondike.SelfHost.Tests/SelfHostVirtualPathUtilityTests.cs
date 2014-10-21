using System;
using NUnit.Framework;
using System.IO;

namespace Klondike.SelfHost.Tests
{
    [TestFixture]
    public class SelfHostVirtualPathUtilityTests
    {
        [Test]
        [TestCase(null)]
        [TestCase("")]
        [TestCase("not_rooted")]
        public void Ctr_WebRoot_ArgumentException(string webRoot)
        {
            TestDelegate call = () => new SelfHostVirtualPathUtility(webRoot, "");

            Assert.That(call, Throws.ArgumentException);
        }

        [Test]
        [TestCase("not_rooted")]
        public void Ctr_VirtualPathRoot_ArgumentException(string virtualPathRoot)
        {
            TestDelegate call = () => new SelfHostVirtualPathUtility(Environment.CurrentDirectory, virtualPathRoot);

            Assert.That(call, Throws.ArgumentException);
        }

        public void Ctr_WebRoot_ArgumentException_DoesNotExist()
        {
            Ctr_WebRoot_ArgumentException(Path.Combine(Environment.CurrentDirectory, "NoSuchSubFolder"));
        }

        [Test]
        [TestCase("~/foo")]
        [TestCase("~//foo")]
        [TestCase("foo")]
        public void MapPath(string virtualPath)
        {
            Assert.That(Utility.MapPath(virtualPath), Is.EqualTo(Path.Combine(Environment.CurrentDirectory, "foo")));
        }

        [Test]
        public void MapPath_Absolute()
        {
            var absolutePath = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);

            Assert.That(Utility.MapPath(absolutePath), Is.EqualTo(absolutePath));
        }

        [Test]
        public void ToAbsolute()
        {
            var result = Utility.ToAbsolute(Path.Combine(Environment.CurrentDirectory, "js", "foo.js"));

            Assert.That(result, Is.EqualTo("/js/foo.js"));
        }

        [Test]
        public void ToAbsolute_HandlesTrailingSlashOnWebRoot()
        {
            var utility = new SelfHostVirtualPathUtility(Environment.CurrentDirectory + Path.DirectorySeparatorChar, "");

            var result = utility.ToAbsolute("foo.js");

            Assert.That(result, Is.EqualTo("/foo.js"));
        }

        [Test]
        public void ToAbsolute_NestedVirtualPathRoot()
        {
            var utility = new SelfHostVirtualPathUtility(Environment.CurrentDirectory, "/child-app");

            var result = utility.ToAbsolute("~/js/foo.js");

            Assert.That(result, Is.EqualTo("/child-app/js/foo.js"));
        }

        [Test]
        public void ToAbsolute_NestedVirtualPathRoot_TrailingSlash()
        {
            var utility = new SelfHostVirtualPathUtility(Environment.CurrentDirectory, "/child/app/");

            var result = utility.ToAbsolute("~/js/foo.js");

            Assert.That(result, Is.EqualTo("/child/app/js/foo.js"));
        }

        [Test]
        public void ToAbsolute_HandlesSlashOnVirtualPathRoot()
        {
            var utility = new SelfHostVirtualPathUtility(Environment.CurrentDirectory, "/");

            var result = utility.ToAbsolute("~/js/foo.js");

            Assert.That(result, Is.EqualTo("/js/foo.js"));
        }

        public SelfHostVirtualPathUtility Utility
        {
            get { return new SelfHostVirtualPathUtility(Environment.CurrentDirectory, ""); }
        }
    }
    
}

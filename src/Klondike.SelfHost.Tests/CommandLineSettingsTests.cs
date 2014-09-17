using System;
using NUnit.Framework;

namespace Klondike.SelfHost.Tests
{
    [TestFixture]
    public class CommandLineSettingsTests
    {
        [Test]
        public void KeyEqualsValueDoubleHyphen()
        {
            var settings = CommandLineSettings.Parse(new[] {"--somekey=true"});

            Assert.That(settings.Get<bool>("somekey"), Is.True, "somekey");
        }

        [Test]
        public void KeyEqualsValueSingleHyphen()
        {
            var settings = CommandLineSettings.Parse(new[] { "-x=5" });

            Assert.That(settings.Get<int>("x"), Is.EqualTo(5), "x");
        }

        [Test]
        public void KeyEqualsValueSlash()
        {
            var settings = CommandLineSettings.Parse(new[] { "/x=five" });

            Assert.That(settings.Get<string>("x"), Is.EqualTo("five"), "x");
        }

        [Test]
        public void CaseInsensitive()
        {
            var settings = CommandLineSettings.Parse(new[] { "/STUFF=five" });

            Assert.That(settings.Get<string>("stuff"), Is.EqualTo("five"), "stuff");
        }

        [Test]
        public void ImplicitTrue()
        {
            var settings = CommandLineSettings.Parse(new[] { "--stuff" });

            Assert.That(settings.Get<bool>("stuff"), Is.EqualTo(true), "x");
        }

        [Test]
        public void GetThrowsOnMissingKey()
        {
            var settings = CommandLineSettings.Parse(new string[0]);

            TestDelegate call = () => settings.Get<string>("stuff");

            Assert.That(call, Throws.InstanceOf<InvalidOperationException>());
        }

        [Test]
        public void ValueOrDefaultGetsValue()
        {
            var settings = CommandLineSettings.Parse(new[] { "--stuff" });

            Assert.That(settings.GetValueOrDefault<bool>("stuff", false), Is.EqualTo(true), "x");
        }

        [Test]
        public void ValueOrDefaultGetsDefault()
        {
            var settings = CommandLineSettings.Parse(new string[0]);

            Assert.That(settings.GetValueOrDefault("stuff", 157), Is.EqualTo(157), "stuff");
        }

        [Test]
        public void MultipleValuesForKey()
        {
            var settings = CommandLineSettings.Parse(new[] {"--thing=a", "--thing=b"});

            Assert.That(settings.GetValues<string>("thing"), Is.EqualTo(new[] {"a", "b"}));
        }
    }
}

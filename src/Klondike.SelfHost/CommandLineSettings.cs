using System;
using System.Collections.Generic;
using System.Linq;

namespace Klondike.SelfHost
{
    public class CommandLineSettings
    {
        private readonly ILookup<string, string> values;

        public CommandLineSettings(ILookup<string, string> values)
        {
            this.values = values;
        }

        public static CommandLineSettings Parse(string[] args)
        {
            var values = new List<KeyValuePair<string, string>>();

            foreach (var arg in args)
            {
                int keyBegin;

                if (arg.StartsWith("--"))
                {
                    keyBegin = 2;
                }
                else if (arg.StartsWith("-") || arg.StartsWith("/"))
                {
                    keyBegin = 1;
                }
                else
                {
                    continue;
                }

                var keyEnd = arg.IndexOf('=');

                if (keyEnd > 0)
                {
                    values.Add(new KeyValuePair<string, string>(arg.Substring(keyBegin, keyEnd - keyBegin), arg.Substring(keyEnd + 1)));
                }
                else
                {
                    values.Add(new KeyValuePair<string, string>(arg.Substring(keyBegin), "true"));
                }
                
            }

            return new CommandLineSettings(values.ToLookup(k => k.Key, k => k.Value, StringComparer.InvariantCultureIgnoreCase));
        }

        public T Get<T>(string key)
        {
            return (T) Convert.ChangeType(values[key].First(), typeof (T));
        }

        public T GetValueOrDefault<T>(string key, T defaultValue)
        {
            var value = values[key].FirstOrDefault();
            if (value != null)
            {
                return (T) Convert.ChangeType(value, typeof (T));
            }
            return defaultValue;
        }

        public IEnumerable<T> GetValues<T>(string key)
        {
            return values[key].Select(k => (T) Convert.ChangeType(k, typeof(T)));
        }
    }
}

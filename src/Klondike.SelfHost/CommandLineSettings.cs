using System;
using System.Collections.Generic;

namespace Klondike.SelfHost
{
    public class CommandLineSettings
    {
        private readonly IDictionary<string, string> values;

        public CommandLineSettings(IDictionary<string, string> values)
        {
            this.values = values;
        }

        public static CommandLineSettings Parse(string[] args)
        {
            var values = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);

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
                    values.Add(arg.Substring(keyBegin, keyEnd - keyBegin), arg.Substring(keyEnd + 1));
                }
                else
                {
                    values.Add(arg.Substring(keyBegin), "true");
                }
                
            }

            return new CommandLineSettings(values);
        }

        public T Get<T>(string key)
        {
            return (T) Convert.ChangeType(values[key], typeof (T));
        }

        public T GetValueOrDefault<T>(string key, T defaultValue)
        {
            string value;
            if (values.TryGetValue(key, out value))
            {
                return (T) Convert.ChangeType(value, typeof (T));
            }
            return defaultValue;
        }
    }
}

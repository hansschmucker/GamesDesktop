using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace StartW
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            if (args.Length < 2)
                return;
            var proc = new Process();

            proc.StartInfo.WorkingDirectory = args[0];
            proc.StartInfo.FileName =args[1];
            if (args.Length > 2)
                proc.StartInfo.Arguments=args[2];

            proc.Start();
        }
    }
}

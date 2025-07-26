﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using WebAssembly;

namespace WasmRoslyn
{
    public class Program
    {
        static CompileService service;

        public static void Main(JSObject app, JSObject outputLog)
        {

            CheckHttpClient();
            service = new CompileService(httpClient, app);

            return;
        }

        public static int AddNums(int a, int b)
        {
            return a+b;
        }

        public static void SayHello(JSObject app)
        {
            app.Invoke("sayHelloCallback", new object[] { "Hello Maddy" });
        }

        public static void Process(JSObject App)
        {
            List<string> assemblies = new List<string>();
            var assembliesText = App.GetObjectProperty("assemblies") as WebAssembly.Core.Array;
            for(int i = 0;i<assembliesText.Length;i++)
            {
                assemblies.Add(assembliesText[i].ToString());
            }

            Task.Run(async () => {
                await service.SetReferences(assemblies);
                // アセンブリ読み込み完了を通知
                App.Invoke("onAssembliesLoaded", new object[] { true });
            });
        }

        public static void Run(JSObject app, string code, JSObject inputLines)
        {
            Task.Run(() => CompileAndRun(app, code, inputLines));
        }

        public static void CompileOnly(JSObject app, string code)
        {
            Task.Run(() => Compile(app, code));
        }

        public static async Task Compile(JSObject app, string code)
        {

            try
            {
                service.CompileLog = new List<string>();
                var type = await service.CompileSourceCode(code);
                if (type != null)
                {
                    service.CompileLog.Add($"Exported type returned from assembly: {type}");
                }
                else
                {
                    service.CompileLog.Add("No exported types were found.");
                }
            }
            catch (Exception e)
            {
                service.CompileLog.Add(e.Message);
                service.CompileLog.Add(e.StackTrace);
                throw;
            }
            finally
            {
                app.Invoke("setCompileLog", new object[] { string.Join("\r\n",service.CompileLog) });
            }

        }


        public static async Task CompileAndRun(JSObject app, string code, JSObject inputLines)
        {

            try
            {
                service.CompileLog = new List<string>();
                
                // JSObjectから入力行のリストを取得
                List<string> inputs = new List<string>();
                if (inputLines != null)
                {
                    var inputArray = inputLines as WebAssembly.Core.Array;
                    if (inputArray != null)
                    {
                        for (int i = 0; i < inputArray.Length; i++)
                        {
                            inputs.Add(inputArray[i]?.ToString() ?? string.Empty);
                        }
                    }
                }
                
                var result = await service.CompileAndRun(code, inputs);
                
                // 結果を配列としてJavaScriptに返す
                if (result != null)
                {
                    app.Invoke("setRunLogArray", new object[] { result.ToArray() });
                }
                else
                {
                    app.Invoke("setRunLogArray", new object[] { new string[] { "Compilation failed" } });
                }

            }
            catch (Exception e)
            {
                service.CompileLog.Add(e.Message);
                service.CompileLog.Add(e.StackTrace);
                throw;
            }
            finally
            {
                app.Invoke("setCompileLog", new object[] { string.Join("\r\n",service.CompileLog) });
            }
        }

        static HttpClient httpClient;
        static string BaseApiUrl = string.Empty;
        static string PathName = string.Empty;
        static string CustomBasePath = string.Empty;
        
        public static void SetBasePath(string basePath)
        {
            CustomBasePath = basePath;
            httpClient = null; // Reset to force recreation
        }
        
        static void CheckHttpClient()
        {
            if (httpClient == null)
            {
                Console.WriteLine("Create  HttpClient");
                using (var window = (JSObject)WebAssembly.Runtime.GetGlobalObject("window"))
                using (var location = (JSObject)window.GetObjectProperty("location"))
                {
                    BaseApiUrl = (string)location.GetObjectProperty("origin");
                    if (!string.IsNullOrEmpty(CustomBasePath))
                    {
                        PathName = CustomBasePath;
                    }
                    else
                    {
                        PathName = (string)location.GetObjectProperty("pathname");
                        // Remove file name if present (e.g., "/examples/basic-usage.html" -> "/examples/")
                        if (PathName.EndsWith(".html"))
                        {
                            var lastSlash = PathName.LastIndexOf('/');
                            if (lastSlash >= 0)
                            {
                                PathName = PathName.Substring(0, lastSlash + 1);
                            }
                        }
                    }
                    Console.WriteLine($"Base: {BaseApiUrl} ReferencePath: {PathName}");
                }
                httpClient = new HttpClient() { BaseAddress = new Uri(new Uri(BaseApiUrl), PathName) };
            }

        }

        private static async Task<String> GetSourceCode(string name)
        {
            Console.WriteLine($"Fetching: {name}");
            CheckHttpClient();

            var source = await httpClient.GetStringAsync(name).ConfigureAwait(false);
            return source;

        }


    }
}
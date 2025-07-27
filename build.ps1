$WASM_SDK = "C:\DevNeil\Mono-Wasm-SDK-Latest"
$CSC_TOOL = "C:\Program Files (x86)\Mono\bin\csc"
$MONO_TOOL = "C:\Program Files (x86)\Mono\bin\mono.exe"

& $CSC_TOOL /nostdlib /noconfig /nologo /langversion:latest -target:library -out:./bin/WasmRoslyn.dll /r:$WASM_SDK/wasm-bcl/wasm/mscorlib.dll /r:$WASM_SDK/wasm-bcl/wasm/System.Core.dll /r:$WASM_SDK/wasm-bcl/wasm/System.dll /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Runtime.dll /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.IO.dll /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Collections.dll /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Text.Encoding.dll /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Threading.dll /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Threading.Tasks.dll /r:$WASM_SDK/wasm-bcl/wasm/System.Net.Http.dll /r:$WASM_SDK/wasm-bcl/wasm/Facades/netstandard.dll  /r:$WASM_SDK/framework/WebAssembly.Bindings.dll /r:$WASM_SDK/framework/WebAssembly.Net.Http.dll /r:./managed/Microsoft.CodeAnalysis.CSharp.dll /r:./managed/Microsoft.CodeAnalysis.dll /r:./managed/System.Collections.Immutable.dll /r:./managed/Newtonsoft.Json.dll Program.cs CompileService.cs

Start-Sleep -Seconds 1.5

# Create a basic index.html for the build if it doesn't exist
if (-not (Test-Path "index.html")) {
    @"
<!DOCTYPE html>
<html>
<head>
    <title>C# WASM Runner</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>C# WASM Runner</h1>
    <p>This is a minimal index.html for build purposes.</p>
    <p>For examples, see: <a href="../examples/basic-usage.html">examples/basic-usage.html</a></p>
</body>
</html>
"@ | Out-File -FilePath "index.html" -Encoding UTF8
}

# Create a basic script.js for the build if it doesn't exist
if (-not (Test-Path "script.js")) {
    "// Basic script.js for build purposes" | Out-File -FilePath "script.js" -Encoding UTF8
}

& $MONO_TOOL $WASM_SDK/packager.exe  --copy=ifnewer --out=publish --search-path=./managed/ --asset=index.html --asset=script.js  ./bin/WasmRoslyn.dll

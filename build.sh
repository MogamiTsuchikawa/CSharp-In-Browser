#!/bin/bash

# Configuration
WASM_SDK="./Mono-Wasm-SDK/Mono-Wasm-SDK-Latest"
CSC_TOOL="mcs"  # Use mcs (Mono C# Compiler) on Linux
MONO_TOOL="mono"

# Check if Mono WASM SDK is extracted
if [ ! -d "./Mono-Wasm-SDK" ]; then
    echo "Extracting Mono WASM SDK..."
    unzip -q Mono-Wasm-SDK-Latest.zip -d Mono-Wasm-SDK
    echo "Mono WASM SDK extracted."
fi

# Create bin directory if it doesn't exist
mkdir -p bin

# Build the project
echo "Building WasmRoslyn.dll..."
$CSC_TOOL /nostdlib /noconfig /nologo /langversion:latest -target:library -out:./bin/WasmRoslyn.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/mscorlib.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/System.Core.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/System.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Runtime.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.IO.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Collections.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Text.Encoding.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Threading.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/Facades/System.Threading.Tasks.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/System.Net.Http.dll \
    /r:$WASM_SDK/wasm-bcl/wasm/Facades/netstandard.dll \
    /r:$WASM_SDK/framework/WebAssembly.Bindings.dll \
    /r:$WASM_SDK/framework/WebAssembly.Net.Http.dll \
    /r:./managed/Microsoft.CodeAnalysis.CSharp.dll \
    /r:./managed/Microsoft.CodeAnalysis.dll \
    /r:./managed/System.Collections.Immutable.dll \
    /r:./managed/Newtonsoft.Json.dll \
    Program.cs CompileService.cs

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Build successful!"
sleep 1.5

# Package the application
echo "Packaging application..."

# Create a basic index.html for the build if it doesn't exist
if [ ! -f "index.html" ]; then
    cat > index.html << 'EOF'
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
EOF
fi

# Create a basic script.js for the build if it doesn't exist
if [ ! -f "script.js" ]; then
    echo "// Basic script.js for build purposes" > script.js
fi

$MONO_TOOL $WASM_SDK/packager.exe --copy=ifnewer --out=publish --search-path=./managed/ --asset=index.html --asset=script.js ./bin/WasmRoslyn.dll

if [ $? -ne 0 ]; then
    echo "Packaging failed!"
    exit 1
fi

# Copy library files to publish directory
echo "Copying library files..."
mkdir -p publish/lib
cp lib/csharp-browser-compiler.js publish/lib/
cp lib/csharp-browser-compiler.d.ts publish/lib/

echo "Build complete! The application is ready in the 'publish' directory."
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based C# compiler that runs entirely in the browser using the Mono WebAssembly runtime. It allows users to write, compile, and execute C# code without any server-side infrastructure.

**Original Project**: Based on [CSharp-In-Browser](https://github.com/nbarkhina/CSharp-In-Browser) by Neil Barkhina
**Library Extensions**: Enhanced by MogamiTsuchikawa with JavaScript/TypeScript library support, NPM packaging, and cross-platform builds.

## Architecture

The project consists of two main components:

1. **C# Backend** (WebAssembly)
   - `Program.cs`: Entry point that bridges JavaScript and C# via WebAssembly
   - `CompileService.cs`: Core compilation service using Roslyn (Microsoft.CodeAnalysis) to compile C# code at runtime
   - Uses Mono WASM SDK to run .NET code in the browser

2. **Web Frontend**
   - `index.html`: Main UI with Monaco editor integration
   - `script.js`: JavaScript code handling UI interactions and WebAssembly communication
   - Monaco Editor for code editing with C# syntax highlighting

## Build Commands

### Prerequisites
1. Unzip Mono WASM SDK (use `Mono-Wasm-SDK-Latest.zip` in repo or download latest)
2. Install Mono on Windows (32-bit version tested)
3. Update paths in `WasmRoslyn.csproj` and `build.ps1` to match your local setup

### Build Process
```powershell
# First time on a new machine, unblock the PowerShell script
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Build the project (run twice if first run gives an error)
.\build.ps1
```

The build script:
1. Compiles C# code to a .NET Standard library using `csc`
2. Packages it for WebAssembly using Mono's packager tool
3. Outputs to the `publish` directory

### Serving the Application
After building, serve the `publish` directory on any web server and access:
```
http://[YOUR_SERVER]/publish/index.html
```

## Key Technical Details

- **Target Framework**: .NET Standard 2.0
- **Roslyn Integration**: Uses Microsoft.CodeAnalysis.CSharp for runtime compilation
- **WebAssembly Bridge**: Uses WebAssembly.Bindings.dll for JS interop
- **Dependencies**: Includes common .NET libraries (System.*, Newtonsoft.Json) pre-loaded in the browser

## Development Notes

- The `managed` directory contains pre-compiled .NET assemblies that are loaded into the browser
- First page load is slow due to downloading all DLLs
- User code must implement a `Run()` method that returns a `Task<string>`
- External assemblies can be loaded via HTTP URLs
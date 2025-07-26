# Notes
This is a fully web based C# Compiler. Simply edit the code and write either a static Main method (Program class) or a Run() method (RunClass). Then click the "Compile and Run" button to see the result. It uses the Mono Webassembly Runtime. You can also load from several included code examples. I added most of the popular .NET System DLL's and a few others like Newtonsoft. You can view a demo of it running here -

<br/>

https://neilb.net/monogithub/

<br/>

The first time you go to the page it may take a long time to load because it has to download all the DLLs

## New Features
- Support for static Main method in Program class
- Console.WriteLine() and Console.ReadLine() support
- Output is returned as string array (accessible via App.outputLines in browser console)
- Input can be provided via App.inputLines array before running

# Build Instructions

## Prerequisites
- Mono development tools installed
- VS Code with C# Extension (optional, for development)

## Linux Build Instructions

### 1. Install Mono (if not already installed)
```bash
# For Ubuntu/Debian:
sudo apt-get update
sudo apt-get install mono-complete

# For Fedora:
sudo dnf install mono-complete

# For other distributions, see: https://www.mono-project.com/download/stable/
```

### 2. Build the project
```bash
# Clone the repository
git clone <repository-url>
cd CSharp-In-Browser

# Make the build script executable
chmod +x build.sh

# Run the build script
./build.sh
```

The build script will:
- Automatically extract the Mono WASM SDK from `Mono-Wasm-SDK-Latest.zip`
- Build the C# project
- Package everything into the `publish` directory

### 3. Serve the application
After building, serve the `publish` directory using any web server:
```bash
# Using Python 3
cd publish
python3 -m http.server 8000

# Using Node.js http-server
npx http-server publish -p 8000

# Using any other web server
# Serve files from the 'publish' directory
```

Then open http://localhost:8000/index.html in your browser.

## Windows Build Instructions

### 1. Install prerequisites
- Install Mono for Windows (32-bit or 64-bit)
  - https://www.mono-project.com/docs/getting-started/install/windows/

### 2. Update paths
- Update paths in `build.ps1` to match your Mono installation

### 3. Build the project
```powershell
# Open PowerShell in the project directory
# For first time, unblock the script:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Run the build script (may need to run twice on first build)
.\build.ps1
```

### 4. Serve the application
Serve the `publish` directory on any web server and access index.html.

## Project Structure
- `Program.cs` - WebAssembly entry point
- `CompileService.cs` - C# compilation service using Roslyn
- `script.js` - Frontend JavaScript code
- `index.html` - Main HTML page with Monaco editor
- `managed/` - Pre-compiled .NET assemblies
- `publish/` - Output directory after building
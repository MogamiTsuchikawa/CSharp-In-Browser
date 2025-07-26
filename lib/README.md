# CSharp Browser Compiler Library

A JavaScript/TypeScript library that allows you to compile and run C# code directly in the browser using Mono WebAssembly.

## Features

- ✅ Compile and run C# code in the browser
- ✅ Support for static Main method and Console I/O
- ✅ TypeScript type definitions included
- ✅ Dynamic DLL loading support
- ✅ Console.ReadLine() input simulation
- ✅ Output captured as string array
- ✅ Full Roslyn compiler diagnostics

## Installation

```bash
npm install csharp-browser-compiler
```

## Quick Start

### JavaScript
```javascript
const CSharpBrowserCompiler = require('csharp-browser-compiler');

const compiler = new CSharpBrowserCompiler({
    onReady: () => console.log('Compiler ready!')
});

const code = `
    using System;
    public class Program {
        public static void Main() {
            Console.WriteLine("Hello from C# in the browser!");
        }
    }
`;

compiler.run(code).then(result => {
    console.log(result.output); // ["Hello from C# in the browser!"]
});
```

### TypeScript
```typescript
import CSharpBrowserCompiler from 'csharp-browser-compiler';

const compiler = new CSharpBrowserCompiler();
await compiler.init();

const result = await compiler.run(`
    using System;
    public class Program {
        public static void Main() {
            Console.WriteLine("Hello, TypeScript!");
        }
    }
`);
```

## API Reference

### Constructor Options

```typescript
interface CompilerOptions {
    monoConfig?: string;      // Path to mono-config.js
    runtimeJs?: string;       // Path to runtime.js
    dotnetJs?: string;        // Path to dotnet.js
    dotnetWasm?: string;      // Path to dotnet.wasm
    assembliesPath?: string;  // Path to managed assemblies
    autoInit?: boolean;       // Auto-initialize (default: true)
    onReady?: () => void;     // Ready callback
    onError?: (error: Error) => void; // Error handler
}
```

### Methods

#### `init(): Promise<void>`
Initialize the compiler runtime. Called automatically unless `autoInit: false`.

#### `run(code: string, options?: RunOptions): Promise<CompileResult>`
Compile and run C# code.

```typescript
const result = await compiler.run(code, {
    inputLines: ['John', '30'] // Input for Console.ReadLine()
});
```

#### `compile(code: string): Promise<CompileResult>`
Compile C# code without running it.

#### `addAssemblies(assemblies: string[]): Promise<void>`
Add custom assemblies (DLLs) to the compiler.

```typescript
// Local assemblies
await compiler.addAssemblies(['MyLibrary', 'AnotherLib']);

// External assemblies
await compiler.addAssemblies(['https://example.com/libs/External.dll']);
```

#### `setInputLines(lines: string[]): void`
Set input lines for Console.ReadLine() calls.

#### `getOutputLines(): string[]`
Get output from the last execution.

#### `getCompileLog(): string[]`
Get compilation messages from the last compilation.

## Advanced Usage

### Console Input/Output

```javascript
// Set input for Console.ReadLine()
compiler.setInputLines(['Alice', '25']);

const code = `
    using System;
    public class Program {
        public static void Main() {
            Console.WriteLine("Enter name:");
            string name = Console.ReadLine();
            Console.WriteLine("Enter age:");
            string age = Console.ReadLine();
            Console.WriteLine($"Hello {name}, age {age}!");
        }
    }
`;

const result = await compiler.run(code);
// Output: ["Enter name:", "Enter age:", "Hello Alice, age 25!"]
```

### Using LINQ and Advanced Features

```javascript
const code = `
    using System;
    using System.Linq;
    
    public class Program {
        public static void Main() {
            var numbers = Enumerable.Range(1, 10);
            var squares = numbers.Select(n => n * n);
            Console.WriteLine(string.Join(", ", squares));
        }
    }
`;

const result = await compiler.run(code);
// Output: ["1, 4, 9, 16, 25, 36, 49, 64, 81, 100"]
```

### Error Handling

```javascript
const result = await compiler.run(invalidCode);

if (!result.success) {
    console.error('Compilation failed:', result.compileLog);
} else {
    console.log('Output:', result.output);
}
```

## Supported Features

- .NET Standard 2.0 APIs
- System.Linq
- System.Collections.Generic
- System.Text.RegularExpressions
- System.Net.Http (limited)
- Newtonsoft.Json
- And many more standard libraries

## Limitations

- No file system access
- No threading (async/await works)
- Limited networking capabilities
- Performance is slower than native execution

## License

MIT
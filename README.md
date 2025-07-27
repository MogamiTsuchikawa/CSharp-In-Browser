# C# WASM Runner

[![npm version](https://badge.fury.io/js/csharp-wasm-runner.svg)](https://badge.fury.io/js/csharp-wasm-runner)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://MogamiTsuchikawa.github.io/CSharp-In-Browser/)

A JavaScript/TypeScript library that allows you to compile and run C# code directly in the browser using Mono WebAssembly. No server required!

> **Note**: This is a fork and extension of the original [CSharp-In-Browser](https://github.com/nbarkhina/CSharp-In-Browser) project by Neil Barkhina. This version adds JavaScript/TypeScript library support, NPM packaging, Linux build support, and enhanced Console I/O capabilities.

## Features

- ✅ Compile and run C# code entirely in the browser
- ✅ Support for static Main method and Console I/O
- ✅ TypeScript support with full type definitions
- ✅ Dynamic DLL loading capability
- ✅ Console.ReadLine() input simulation
- ✅ Real-time compilation diagnostics
- ✅ Multiple module formats (UMD, ESM, CommonJS)

## Quick Start

### NPM Installation

```bash
npm install csharp-wasm-runner
```

### CDN Usage

```html
<!-- Via unpkg -->
<script src="https://unpkg.com/csharp-wasm-runner/dist/csharp-browser-compiler.umd.js"></script>

<!-- Via jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/csharp-wasm-runner/dist/csharp-browser-compiler.umd.js"></script>
```

### Basic Usage

```javascript
// ES6 modules
import CSharpBrowserCompiler from 'csharp-wasm-runner';

// CommonJS
const CSharpBrowserCompiler = require('csharp-wasm-runner');

// Initialize compiler
const compiler = new CSharpBrowserCompiler();

// Compile and run C# code
const result = await compiler.run(`
    using System;
    public class Program {
        public static void Main() {
            Console.WriteLine("Hello from C# in the browser!");
        }
    }
`);

console.log(result.output); // ["Hello from C# in the browser!"]
```

### TypeScript Usage

```typescript
import CSharpBrowserCompiler, { CompileResult } from 'csharp-wasm-runner';

const compiler = new CSharpBrowserCompiler();

const result: CompileResult = await compiler.run(`
    using System;
    using System.Linq;
    
    public class Program {
        public static void Main() {
            var numbers = Enumerable.Range(1, 5);
            var squares = numbers.Select(n => n * n);
            Console.WriteLine($"Squares: {string.Join(", ", squares)}");
        }
    }
`);

if (result.success) {
    console.log('Output:', result.output);
} else {
    console.error('Compilation failed:', result.compileLog);
}
```

## Advanced Features

### Console Input/Output

```javascript
// Set input for Console.ReadLine()
compiler.setInputLines(['Alice', '25']);

const result = await compiler.run(`
    using System;
    public class Program {
        public static void Main() {
            Console.WriteLine("Enter your name:");
            string name = Console.ReadLine();
            Console.WriteLine("Enter your age:");
            string age = Console.ReadLine();
            Console.WriteLine($"Hello {name}, you are {age} years old!");
        }
    }
`);
// Output: ["Enter your name:", "Enter your age:", "Hello Alice, you are 25 years old!"]
```

### Custom Assembly Loading

```javascript
// Load additional assemblies
await compiler.addAssemblies(['System.Text.Json', 'MyCustomLibrary']);

const result = await compiler.run(`
    using System;
    using System.Text.Json;
    
    public class Program {
        public static void Main() {
            var json = JsonSerializer.Serialize(new { message = "Hello JSON!" });
            Console.WriteLine(json);
        }
    }
`);
```

### Configuration Options

```javascript
const compiler = new CSharpBrowserCompiler({
    // Runtime paths (auto-detected for NPM packages)
    runtimePath: '/assets/csharp-runtime/',
    monoConfig: '/path/to/mono-config.js',
    dotnetJs: '/path/to/dotnet.js',
    dotnetWasm: '/path/to/dotnet.wasm',
    assembliesPath: '/path/to/managed/',
    
    // Base path for asset loading
    basePath: '/custom/path/',
    
    // Auto-initialization (default: true)
    autoInit: true,
    
    // Callbacks
    onReady: () => console.log('Compiler ready!'),
    onError: (error) => console.error('Compiler error:', error)
});
```

## API Reference

### Constructor Options

```typescript
interface CompilerOptions {
    runtimePath?: string;        // Path to runtime files (auto-detected for NPM)
    monoConfig?: string;         // Path to mono-config.js
    runtimeJs?: string;          // Path to runtime.js
    dotnetJs?: string;           // Path to dotnet.js
    dotnetWasm?: string;         // Path to dotnet.wasm
    assembliesPath?: string;     // Path to managed assemblies
    basePath?: string;           // Base path for asset loading
    autoInit?: boolean;          // Auto-initialize on construction (default: true)
    onReady?: () => void;        // Ready callback
    onError?: (error: Error) => void; // Error handler
}
```

### Methods

#### `init(): Promise<void>`
Initialize the compiler runtime.

#### `run(code: string, options?: RunOptions): Promise<CompileResult>`
Compile and run C# code.

#### `compile(code: string): Promise<CompileResult>`
Compile C# code without running.

#### `addAssemblies(assemblies: string[]): Promise<void>`
Add custom assemblies to the compiler.

#### `setInputLines(lines: string[]): void`
Set input lines for Console.ReadLine().

## Supported C# Features

- .NET Standard 2.0 APIs
- System.Linq
- System.Collections.Generic
- System.Text.RegularExpressions
- System.Net.Http (limited)
- Newtonsoft.Json
- Custom assemblies via URL loading

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/MogamiTsuchikawa/CSharp-In-Browser.git
cd CSharp-In-Browser

# Install dependencies (if any)
npm install

# Build the project
npm run build

# Test locally
npm run example
```

### GitHub Pages Deployment

This project automatically deploys examples to GitHub Pages via GitHub Actions:

- **Live Demo**: [https://MogamiTsuchikawa.github.io/CSharp-In-Browser/](https://MogamiTsuchikawa.github.io/CSharp-In-Browser/)
- **Deployment**: Triggered on pushes to `master` branch
- **Examples**: Interactive C# compiler with Monaco editor

### NPM Publishing

The package is automatically published to NPM when a new release is created:

```bash
# Create a new release (triggers NPM publish)
git tag v1.0.1
git push origin v1.0.1

# Or use GitHub's release interface
# The workflow will automatically:
# 1. Build the project with Mono
# 2. Package for NPM with correct naming
# 3. Publish to NPM registry
# 4. Attach release assets
```

### Linux Build

```bash
# Install Mono
sudo apt-get install mono-complete

# Build
./build.sh
```

### Windows Build

```powershell
# Install Mono for Windows
# Update paths in build.ps1

# Build
.\build.ps1
```

## Examples

### Online Demo
Try the interactive examples on GitHub Pages: [https://MogamiTsuchikawa.github.io/CSharp-In-Browser/](https://MogamiTsuchikawa.github.io/CSharp-In-Browser/)

### Local Examples
See the [examples](./examples/) directory for complete usage examples:

- [Basic Usage](./examples/basic-usage.html) - HTML example with UI
- [TypeScript Example](./examples/typescript-example.ts) - Advanced TypeScript usage

### NPM Package Integration
```javascript
// Node.js/Webpack project
import CSharpBrowserCompiler from 'csharp-wasm-runner';

// Initialize with default settings (uses package runtime)
const compiler = new CSharpBrowserCompiler();

// Or with custom configuration
const compiler = new CSharpBrowserCompiler({
    // For production, you can use CDN
    runtimePath: 'https://unpkg.com/csharp-wasm-runner/runtime/',
    onReady: () => console.log('Ready to compile C#!'),
    onError: (err) => console.error('Compiler error:', err)
});

// Compile and run
const result = await compiler.run(`
    using System;
    using System.Linq;
    
    public class Program {
        public static void Main() {
            var fibonacci = GenerateFibonacci(10);
            Console.WriteLine($"Fibonacci: {string.Join(", ", fibonacci)}");
        }
        
        static int[] GenerateFibonacci(int count) {
            return Enumerable.Range(0, count)
                .Aggregate(new int[] { 0, 1 }, (acc, _) => 
                    acc.Concat(new[] { acc[^1] + acc[^2] }).ToArray())
                .Take(count).ToArray();
        }
    }
`);

console.log(result.output);
```

## Framework Integration

### Next.js / React

For optimal performance in Next.js applications, place runtime files in the `public` directory:

```bash
# After installing the package
npm install csharp-wasm-runner

# Copy runtime files to public directory
cp -r node_modules/csharp-wasm-runner/runtime public/csharp-runtime
```

**Next.js usage example:**

```typescript
// pages/csharp-compiler.tsx or app/csharp-compiler/page.tsx
'use client'; // Required for app directory

import { useEffect, useState } from 'react';
import CSharpBrowserCompiler from 'csharp-wasm-runner';

export default function CSharpCompiler() {
  const [compiler, setCompiler] = useState<CSharpBrowserCompiler | null>(null);
  const [output, setOutput] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initCompiler = async () => {
      const comp = new CSharpBrowserCompiler({
        // Use public directory for runtime files
        runtimePath: '/csharp-runtime/',
        onReady: () => setIsReady(true),
        onError: (error) => console.error('Compiler error:', error)
      });
      setCompiler(comp);
    };

    initCompiler();
  }, []);

  const runCode = async () => {
    if (!compiler || !isReady) return;
    
    const result = await compiler.run(`
      using System;
      public class Program {
        public static void Main() {
          Console.WriteLine("Hello from Next.js + C#!");
        }
      }
    `);
    
    setOutput(result.output.join('\n'));
  };

  return (
    <div>
      <button onClick={runCode} disabled={!isReady}>
        {isReady ? 'Run C# Code' : 'Loading...'}
      </button>
      <pre>{output}</pre>
    </div>
  );
}
```

### Vite / Vue / React (SPA)

For Vite-based applications, copy runtime files to the `public` directory:

```bash
# Copy runtime files
cp -r node_modules/csharp-wasm-runner/runtime public/

# In your component
const compiler = new CSharpBrowserCompiler({
  runtimePath: '/runtime/',
  // ... other options
});
```

### Webpack Configuration

For custom Webpack setups, ensure WebAssembly files are served correctly:

```javascript
// webpack.config.js
module.exports = {
  // ... other config
  experiments: {
    asyncWebAssembly: true,
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'webassembly/async',
      },
    ],
  },
};
```

### CDN Deployment

For production deployments, consider using a CDN for runtime files:

```javascript
const compiler = new CSharpBrowserCompiler({
  runtimePath: 'https://cdn.jsdelivr.net/npm/csharp-wasm-runner@1.0.1/runtime/',
  // or
  runtimePath: 'https://unpkg.com/csharp-wasm-runner@1.0.1/runtime/',
});
```

### Automated Setup

Add a post-install script to your project's `package.json` for automatic runtime copying:

```json
{
  "scripts": {
    "postinstall": "cp -r node_modules/csharp-wasm-runner/runtime public/csharp-runtime",
    "setup-csharp": "cp -r node_modules/csharp-wasm-runner/runtime public/csharp-runtime"
  }
}
```

Or create a setup script:

```bash
#!/bin/bash
# setup-csharp.sh
echo "Setting up C# WASM Runner..."
mkdir -p public/csharp-runtime
cp -r node_modules/csharp-wasm-runner/runtime/* public/csharp-runtime/
echo "Runtime files copied to public/csharp-runtime/"
```

## Performance Considerations

### Runtime File Size (25MB total)
- **Initial Load**: Runtime files are ~25MB uncompressed
- **Caching**: Enable browser caching for `.wasm` and `.dll` files
- **Compression**: Use gzip/brotli compression on your server
- **Lazy Loading**: Initialize compiler only when needed

### Recommended Deployment Strategy

1. **Copy runtime to public directory**:
   ```bash
   cp -r node_modules/csharp-wasm-runner/runtime public/csharp-runtime
   ```

2. **Configure server headers** (nginx example):
   ```nginx
   location /csharp-runtime/ {
     expires 1y;
     add_header Cache-Control "public, immutable";
     gzip on;
     gzip_types application/wasm application/octet-stream;
   }
   ```

3. **Use service worker for caching** (optional):
   ```javascript
   // Cache runtime files for offline use
   const CACHE_NAME = 'csharp-runtime-v1';
   const RUNTIME_FILES = [
     '/csharp-runtime/dotnet.wasm',
     '/csharp-runtime/dotnet.js',
     // ... other files
   ];
   ```

### Memory Usage
- **WebAssembly Heap**: ~50-100MB during compilation
- **Browser Limit**: Consider memory constraints on mobile devices
- **Cleanup**: Call `compiler.dispose()` when done (if available)

## Limitations

- No file system access (browser security)
- No threading (async/await works)
- Limited networking capabilities
- Performance is slower than native execution

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

**Original Project**: [CSharp-In-Browser](https://github.com/nbarkhina/CSharp-In-Browser) by Neil Barkhina
- Base C# in browser functionality
- Mono WebAssembly integration
- Monaco Editor integration

**Library Extensions and NPM Package**: MogamiTsuchikawa
- JavaScript/TypeScript library wrapper
- NPM package support with multiple module formats
- Enhanced Console I/O with ReadLine support
- Linux build scripts and cross-platform compatibility
- Static Main method support
- Dynamic DLL loading functionality
- TypeScript type definitions

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Built on top of [Mono WebAssembly](https://www.mono-project.com/docs/tools+libraries/tools/wasm/)
- Uses [Microsoft Roslyn](https://github.com/dotnet/roslyn) for C# compilation
- Monaco Editor integration for code editing
- Original concept and implementation by Neil Barkhina

---

# CSharp Browser Compiler (日本語)

[![npm version](https://badge.fury.io/js/csharp-wasm-runner.svg)](https://badge.fury.io/js/csharp-wasm-runner)

Mono WebAssemblyを使用してブラウザで直接C#コードをコンパイル・実行できるJavaScript/TypeScriptライブラリです。サーバーは不要です！

> **注意**: これはNeil Barkhinaによる元の[CSharp-In-Browser](https://github.com/nbarkhina/CSharp-In-Browser)プロジェクトのフォーク・拡張版です。このバージョンではJavaScript/TypeScriptライブラリサポート、NPMパッケージング、Linux対応、強化されたConsole I/O機能が追加されています。

## 機能

- ✅ ブラウザで完全にC#コードをコンパイル・実行
- ✅ static Mainメソッドとコンソール入出力のサポート
- ✅ 完全な型定義によるTypeScriptサポート
- ✅ 動的DLL読み込み機能
- ✅ Console.ReadLine()入力シミュレーション
- ✅ リアルタイムコンパイル診断
- ✅ 複数のモジュール形式（UMD、ESM、CommonJS）

## クイックスタート

### NPMインストール

```bash
npm install csharp-wasm-runner
```

### CDN利用

```html
<!-- unpkg経由 -->
<script src="https://unpkg.com/csharp-wasm-runner/dist/csharp-browser-compiler.umd.js"></script>

<!-- jsDelivr経由 -->
<script src="https://cdn.jsdelivr.net/npm/csharp-wasm-runner/dist/csharp-browser-compiler.umd.js"></script>
```

### 基本的な使用方法

```javascript
// ES6モジュール
import CSharpBrowserCompiler from 'csharp-wasm-runner';

// CommonJS
const CSharpBrowserCompiler = require('csharp-wasm-runner');

// コンパイラを初期化
const compiler = new CSharpBrowserCompiler();

// C#コードをコンパイル・実行
const result = await compiler.run(`
    using System;
    public class Program {
        public static void Main() {
            Console.WriteLine("ブラウザからのC#コード実行！");
        }
    }
`);

console.log(result.output); // ["ブラウザからのC#コード実行！"]
```

## フレームワーク統合

### Next.js / React

Next.jsアプリケーションでの最適なパフォーマンスのため、ランタイムファイルを`public`ディレクトリに配置してください：

```bash
# パッケージインストール後
npm install csharp-wasm-runner

# ランタイムファイルをpublicディレクトリにコピー
cp -r node_modules/csharp-wasm-runner/runtime public/csharp-runtime
```

**Next.js使用例:**

```typescript
// pages/csharp-compiler.tsx または app/csharp-compiler/page.tsx
'use client'; // app ディレクトリでは必須

import { useEffect, useState } from 'react';
import CSharpBrowserCompiler from 'csharp-wasm-runner';

export default function CSharpCompiler() {
  const [compiler, setCompiler] = useState<CSharpBrowserCompiler | null>(null);
  const [output, setOutput] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initCompiler = async () => {
      const comp = new CSharpBrowserCompiler({
        // publicディレクトリのランタイムファイルを使用
        runtimePath: '/csharp-runtime/',
        onReady: () => setIsReady(true),
        onError: (error) => console.error('コンパイラエラー:', error)
      });
      setCompiler(comp);
    };

    initCompiler();
  }, []);

  const runCode = async () => {
    if (!compiler || !isReady) return;
    
    const result = await compiler.run(`
      using System;
      public class Program {
        public static void Main() {
          Console.WriteLine("Next.js + C#からこんにちは！");
        }
      }
    `);
    
    setOutput(result.output.join('\n'));
  };

  return (
    <div>
      <button onClick={runCode} disabled={!isReady}>
        {isReady ? 'C#コード実行' : '読み込み中...'}
      </button>
      <pre>{output}</pre>
    </div>
  );
}
```

### 推奨デプロイメント戦略

1. **ランタイムをpublicディレクトリにコピー**:
   ```bash
   cp -r node_modules/csharp-wasm-runner/runtime public/csharp-runtime
   ```

2. **サーバーヘッダーの設定** (nginx例):
   ```nginx
   location /csharp-runtime/ {
     expires 1y;
     add_header Cache-Control "public, immutable";
     gzip on;
     gzip_types application/wasm application/octet-stream;
   }
   ```

### TypeScript使用例

```typescript
import CSharpBrowserCompiler, { CompileResult } from 'csharp-wasm-runner';

const compiler = new CSharpBrowserCompiler();

const result: CompileResult = await compiler.run(`
    using System;
    using System.Linq;
    
    public class Program {
        public static void Main() {
            var numbers = Enumerable.Range(1, 5);
            var squares = numbers.Select(n => n * n);
            Console.WriteLine($"平方数: {string.Join(", ", squares)}");
        }
    }
`);

if (result.success) {
    console.log('出力:', result.output);
} else {
    console.error('コンパイル失敗:', result.compileLog);
}
```

## 高度な機能

### コンソール入出力

```javascript
// Console.ReadLine()用の入力を設定
compiler.setInputLines(['太郎', '25']);

const result = await compiler.run(`
    using System;
    public class Program {
        public static void Main() {
            Console.WriteLine("お名前を入力してください:");
            string name = Console.ReadLine();
            Console.WriteLine("年齢を入力してください:");
            string age = Console.ReadLine();
            Console.WriteLine($"こんにちは{name}さん、{age}歳ですね！");
        }
    }
`);
// 出力: ["お名前を入力してください:", "年齢を入力してください:", "こんにちは太郎さん、25歳ですね！"]
```

### カスタムアセンブリの読み込み

```javascript
// 追加のアセンブリを読み込み
await compiler.addAssemblies(['System.Text.Json', 'MyCustomLibrary']);

const result = await compiler.run(`
    using System;
    using System.Text.Json;
    
    public class Program {
        public static void Main() {
            var json = JsonSerializer.Serialize(new { message = "こんにちはJSON！" });
            Console.WriteLine(json);
        }
    }
`);
```

### 設定オプション

```javascript
const compiler = new CSharpBrowserCompiler({
    // カスタムランタイムパス（異なるデプロイシナリオに有用）
    runtimePath: '/assets/csharp-runtime/',
    
    // コールバック
    onReady: () => console.log('コンパイラ準備完了！'),
    onError: (error) => console.error('コンパイラエラー:', error),
    
    // 高度なオプション
    useLibraryRuntime: true, // 内蔵ランタイムを使用（デフォルト: true）
    basePath: '/custom/path/' // アセット読み込み用カスタムベースパス
});
```

## API リファレンス

### コンストラクタオプション

```typescript
interface CompilerOptions {
    runtimePath?: string;        // ランタイムファイルへのパス
    monoConfig?: string;         // mono-config.jsへのパス
    dotnetJs?: string;           // dotnet.jsへのパス
    dotnetWasm?: string;         // dotnet.wasmへのパス
    assembliesPath?: string;     // マネージドアセンブリへのパス
    basePath?: string;           // カスタムベースパス
    useLibraryRuntime?: boolean; // ライブラリランタイムを使用（デフォルト: true）
    onReady?: () => void;        // 準備完了コールバック
    onError?: (error: Error) => void; // エラーハンドラ
}
```

### メソッド

#### `init(): Promise<void>`
コンパイラランタイムを初期化します。

#### `run(code: string, options?: RunOptions): Promise<CompileResult>`
C#コードをコンパイル・実行します。

#### `compile(code: string): Promise<CompileResult>`
C#コードをコンパイルのみ行います。

#### `addAssemblies(assemblies: string[]): Promise<void>`
カスタムアセンブリをコンパイラに追加します。

#### `setInputLines(lines: string[]): void`
Console.ReadLine()用の入力行を設定します。

## サポートするC#機能

- .NET Standard 2.0 APIs
- System.Linq
- System.Collections.Generic
- System.Text.RegularExpressions
- System.Net.Http（制限あり）
- Newtonsoft.Json
- URL経由のカスタムアセンブリ

## 開発

### ソースからのビルド

```bash
# リポジトリをクローン
git clone https://github.com/nbarkhina/CSharp-In-Browser.git
cd CSharp-In-Browser

# 依存関係をインストール（もしあれば）
npm install

# プロジェクトをビルド
npm run build

# ローカルでテスト
npm run example
```

### Linux でのビルド

```bash
# Monoをインストール
sudo apt-get install mono-complete

# ビルド
./build.sh
```

### Windows でのビルド

```powershell
# Windows用Monoをインストール
# build.ps1のパスを更新

# ビルド
.\build.ps1
```

## サンプル

完全な使用例については[examples](./examples/)ディレクトリを参照してください：

- [基本的な使用方法](./examples/basic-usage.html) - UI付きHTMLサンプル
- [TypeScriptサンプル](./examples/typescript-example.ts) - 高度なTypeScript使用例

## 制限事項

- ファイルシステムアクセスなし（ブラウザセキュリティ）
- スレッド処理なし（async/awaitは動作）
- 限定的なネットワーク機能
- ネイティブ実行より遅いパフォーマンス

## 貢献

貢献を歓迎します！プルリクエストをお気軽に送信してください。

## クレジット

**元プロジェクト**: Neil Barkhinaによる[CSharp-In-Browser](https://github.com/nbarkhina/CSharp-In-Browser)
- ブラウザでのC#基本機能
- Mono WebAssembly統合
- Monaco Editor統合

**ライブラリ拡張とNPMパッケージ**: MogamiTsuchikawa
- JavaScript/TypeScriptライブラリラッパー
- 複数モジュール形式対応のNPMパッケージサポート
- ReadLineサポート付き強化Console I/O
- Linuxビルドスクリプトとクロスプラットフォーム対応
- static Mainメソッドサポート
- 動的DLL読み込み機能
- TypeScript型定義

## ライセンス

MIT License - 詳細は[LICENSE](./LICENSE)ファイルを参照してください。

## 謝辞

- [Mono WebAssembly](https://www.mono-project.com/docs/tools+libraries/tools/wasm/)上に構築
- C#コンパイルに[Microsoft Roslyn](https://github.com/dotnet/roslyn)を使用
- Monaco Editorコード編集統合
- 元の概念・実装: Neil Barkhina
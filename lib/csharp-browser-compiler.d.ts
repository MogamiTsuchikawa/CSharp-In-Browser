/**
 * CSharp Browser Compiler TypeScript Definitions
 */

export interface CompilerOptions {
    /** Path to mono-config.js file */
    monoConfig?: string;
    /** Path to runtime.js file */
    runtimeJs?: string;
    /** Path to dotnet.js file */
    dotnetJs?: string;
    /** Path to dotnet.wasm file */
    dotnetWasm?: string;
    /** Path to managed assemblies directory */
    assembliesPath?: string;
    /** Auto-initialize on construction (default: true) */
    autoInit?: boolean;
    /** Callback when compiler is ready */
    onReady?: () => void;
    /** Error handler */
    onError?: (error: Error) => void;
}

export interface RunOptions {
    /** Input lines for Console.ReadLine() */
    inputLines?: string[];
}

export interface CompileResult {
    /** Whether compilation was successful */
    success: boolean;
    /** Output lines from the program execution */
    output?: string[];
    /** Compilation log messages */
    compileLog: string[];
    /** Error message if compilation failed */
    error?: string;
}

export default class CSharpBrowserCompiler {
    /**
     * Create a new C# Browser Compiler instance
     * @param options - Compiler configuration options
     */
    constructor(options?: CompilerOptions);

    /**
     * Whether the compiler is ready to use
     */
    readonly isReady: boolean;

    /**
     * Initialize the compiler runtime
     * @returns Promise that resolves when initialization is complete
     */
    init(): Promise<void>;

    /**
     * Compile and run C# code
     * @param code - C# source code to compile and run
     * @param options - Execution options
     * @returns Promise with compilation and execution results
     * 
     * @example
     * ```typescript
     * const result = await compiler.run(`
     *     using System;
     *     public class Program {
     *         public static void Main() {
     *             Console.WriteLine("Hello, World!");
     *         }
     *     }
     * `);
     * console.log(result.output); // ["Hello, World!"]
     * ```
     */
    run(code: string, options?: RunOptions): Promise<CompileResult>;

    /**
     * Compile C# code without running it
     * @param code - C# source code to compile
     * @returns Promise with compilation results
     */
    compile(code: string): Promise<CompileResult>;

    /**
     * Add custom assemblies (DLLs) to the compiler
     * @param assemblies - Array of assembly URLs or names
     * @returns Promise that resolves when assemblies are loaded
     * 
     * @example
     * ```typescript
     * // Add local assemblies by name
     * await compiler.addAssemblies(['MyLibrary', 'AnotherLib']);
     * 
     * // Add external assemblies by URL
     * await compiler.addAssemblies(['https://example.com/libs/External.dll']);
     * ```
     */
    addAssemblies(assemblies: string[]): Promise<void>;

    /**
     * Get list of currently loaded custom assemblies
     * @returns Array of assembly names/URLs
     */
    getAssemblies(): string[];

    /**
     * Set input lines for Console.ReadLine() calls
     * @param lines - Array of input strings
     * 
     * @example
     * ```typescript
     * compiler.setInputLines(['John', '25']);
     * const result = await compiler.run(`
     *     using System;
     *     public class Program {
     *         public static void Main() {
     *             Console.WriteLine("Enter name:");
     *             string name = Console.ReadLine();
     *             Console.WriteLine("Enter age:");
     *             string age = Console.ReadLine();
     *             Console.WriteLine($"Hello {name}, age {age}!");
     *         }
     *     }
     * `);
     * ```
     */
    setInputLines(lines: string[]): void;

    /**
     * Get output lines from the last execution
     * @returns Array of output strings
     */
    getOutputLines(): string[];

    /**
     * Get compilation log from the last compilation
     * @returns Array of log message strings
     */
    getCompileLog(): string[];
}

/**
 * Global variable types (for advanced usage)
 */
declare global {
    interface Window {
        CSharpBrowserCompiler: typeof CSharpBrowserCompiler;
        BINDING: {
            call_static_method(method: string, args: any[]): any;
        };
        Module: {
            mono_bind_static_method(method: string): Function;
        };
    }
}
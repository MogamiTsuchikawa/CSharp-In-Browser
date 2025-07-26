import CSharpBrowserCompiler from '../lib/csharp-browser-compiler';

async function main() {
    // Initialize the compiler
    const compiler = new CSharpBrowserCompiler({
        monoConfig: './publish/mono-config.js',
        runtimeJs: './publish/runtime.js',
        dotnetJs: './publish/dotnet.js',
        onReady: () => console.log('Compiler ready!'),
        onError: (error) => console.error('Compiler error:', error)
    });

    // Wait for initialization
    await compiler.init();

    // Example 1: Simple Hello World
    const helloWorldCode = `
        using System;
        public class Program {
            public static void Main() {
                Console.WriteLine("Hello, TypeScript!");
            }
        }
    `;

    const result1 = await compiler.run(helloWorldCode);
    console.log('Hello World output:', result1.output);

    // Example 2: Using Console.ReadLine with input
    const interactiveCode = `
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
    `;

    compiler.setInputLines(['Alice', '25']);
    const result2 = await compiler.run(interactiveCode);
    console.log('Interactive output:', result2.output);

    // Example 3: Using LINQ and advanced features
    const advancedCode = `
        using System;
        using System.Linq;
        using System.Collections.Generic;

        public class Program {
            public static void Main() {
                var numbers = Enumerable.Range(1, 10);
                var evenSquares = numbers
                    .Where(n => n % 2 == 0)
                    .Select(n => n * n);
                
                Console.WriteLine("Even squares: " + string.Join(", ", evenSquares));
                
                var dict = new Dictionary<string, int> {
                    ["apple"] = 5,
                    ["banana"] = 3,
                    ["orange"] = 7
                };
                
                foreach (var kvp in dict.OrderBy(x => x.Value)) {
                    Console.WriteLine($"{kvp.Key}: {kvp.Value}");
                }
            }
        }
    `;

    const result3 = await compiler.run(advancedCode);
    console.log('Advanced features output:', result3.output);

    // Example 4: Loading external assemblies
    try {
        // Add a custom assembly (example URL)
        await compiler.addAssemblies(['https://example.com/MyLibrary.dll']);
        
        // Now you can use types from MyLibrary
        const customCode = `
            using System;
            using MyLibrary; // Assuming MyLibrary namespace exists
            
            public class Program {
                public static void Main() {
                    // Use types from MyLibrary
                    Console.WriteLine("Using custom assembly!");
                }
            }
        `;
        
        const result4 = await compiler.run(customCode);
        console.log('Custom assembly output:', result4.output);
    } catch (error) {
        console.error('Failed to load custom assembly:', error);
    }

    // Example 5: Error handling
    const errorCode = `
        using System;
        public class Program {
            public static void Main() {
                // This will cause a compilation error
                int x = "not a number";
            }
        }
    `;

    const errorResult = await compiler.run(errorCode);
    if (!errorResult.success) {
        console.log('Compilation errors:', errorResult.compileLog);
    }
}

// Run the examples
main().catch(console.error);
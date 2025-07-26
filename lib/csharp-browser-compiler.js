/**
 * CSharp Browser Compiler Library
 * Compile and run C# code directly in the browser using Mono WebAssembly
 */

class CSharpBrowserCompiler {
    constructor(options = {}) {
        this.options = {
            monoConfig: options.monoConfig || 'mono-config.js',
            runtimeJs: options.runtimeJs || 'runtime.js',
            dotnetJs: options.dotnetJs || 'dotnet.js',
            dotnetWasm: options.dotnetWasm || 'dotnet.wasm',
            assembliesPath: options.assembliesPath || 'managed/',
            basePath: options.basePath || null, // Custom base path for asset loading
            useLibraryRuntime: options.useLibraryRuntime !== false, // Default to true
            onReady: options.onReady || (() => {}),
            onError: options.onError || ((error) => console.error(error))
        };
        
        this.isReady = false;
        this.readyPromise = null;
        this.customAssemblies = [];
        this.inputLines = [];
        this.outputLines = [];
        this.compileLog = [];
        
        // Initialize if auto-init is enabled (default)
        if (options.autoInit !== false) {
            this.init();
        }
    }

    /**
     * Initialize the Mono runtime
     */
    async init() {
        if (this.readyPromise) {
            return this.readyPromise;
        }

        this.readyPromise = new Promise(async (resolve, reject) => {
            try {
                // Set global config for mono
                window.config = window.config || {};
                
                // If using library runtime, setup Module object first
                if (this.options.useLibraryRuntime) {
                    window.Module = window.Module || {
                        onRuntimeInitialized: function () {
                            if (typeof MONO !== 'undefined' && MONO.mono_load_runtime_and_bcl) {
                                MONO.mono_load_runtime_and_bcl(
                                    config.vfs_prefix,
                                    config.deploy_prefix,
                                    config.enable_debugging,
                                    config.file_list,
                                    function () {
                                        console.log('Mono runtime loaded');
                                    }
                                );
                            }
                        }
                    };
                }
                
                // Load Mono configuration
                await this._loadScript(this.options.monoConfig);
                
                // Load runtime.js only if not using library runtime
                if (!this.options.useLibraryRuntime) {
                    await this._loadScript(this.options.runtimeJs);
                }
                
                // Load dotnet.js which initializes the WASM runtime
                // Note: dotnet.js uses a deferred loading mechanism
                await this._loadScript(this.options.dotnetJs);
                
                // Wait for runtime to be ready
                await this._waitForRuntime();
                
                // Additional wait to ensure full initialization
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Set custom base path if provided
                if (this.options.basePath) {
                    BINDING.call_static_method(
                        "[WasmRoslyn]WasmRoslyn.Program:SetBasePath",
                        [this.options.basePath]
                    );
                }
                
                // Initialize the C# compiler service
                this._initializeCompilerService();
                
                this.isReady = true;
                this.options.onReady();
                resolve();
            } catch (error) {
                this.options.onError(error);
                reject(error);
            }
        });

        return this.readyPromise;
    }

    /**
     * Compile and run C# code
     * @param {string} code - C# source code
     * @param {Object} options - Execution options
     * @returns {Promise<CompileResult>}
     */
    async run(code, options = {}) {
        await this.init();
        
        // Set input lines if provided
        if (options.inputLines) {
            this.inputLines = options.inputLines;
        }
        
        return new Promise((resolve, reject) => {
            try {
                // Reset output
                this.outputLines = [];
                this.compileLog = [];
                
                // Create a temporary app object that mimics the original interface
                const app = {
                    inputLines: this.inputLines,
                    setRunLogArray: (lines) => {
                        this.outputLines = lines;
                    },
                    setCompileLog: (log) => {
                        this.compileLog = log.split('\r\n');
                    }
                };
                
                // Set up completion callback
                const originalSetRunLogArray = app.setRunLogArray;
                app.setRunLogArray = (lines) => {
                    originalSetRunLogArray(lines);
                    
                    // Resolve with the result
                    resolve({
                        success: true,
                        output: lines,
                        compileLog: this.compileLog
                    });
                };
                
                // Handle compilation errors
                const originalSetCompileLog = app.setCompileLog;
                app.setCompileLog = (log) => {
                    originalSetCompileLog(log);
                    
                    if (log.includes('Compilation error') || log.includes('Parse SyntaxTree Error')) {
                        resolve({
                            success: false,
                            output: [],
                            compileLog: this.compileLog,
                            error: 'Compilation failed'
                        });
                    }
                };
                
                // Call the C# Run method
                BINDING.call_static_method(
                    "[WasmRoslyn]WasmRoslyn.Program:Run",
                    [app, code, this.inputLines]
                );
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Compile C# code without running
     * @param {string} code - C# source code
     * @returns {Promise<CompileResult>}
     */
    async compile(code) {
        await this.init();
        
        return new Promise((resolve, reject) => {
            try {
                this.compileLog = [];
                
                const app = {
                    setCompileLog: (log) => {
                        this.compileLog = log.split('\r\n');
                        
                        const success = log.includes('Compilation success');
                        resolve({
                            success: success,
                            compileLog: this.compileLog
                        });
                    }
                };
                
                BINDING.call_static_method(
                    "[WasmRoslyn]WasmRoslyn.Program:CompileOnly",
                    [app, code]
                );
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Add custom assemblies (DLLs) to the compiler
     * @param {string[]} assemblies - Array of assembly URLs or names
     */
    async addAssemblies(assemblies) {
        await this.init();
        
        this.customAssemblies = [...this.customAssemblies, ...assemblies];
        
        return new Promise((resolve, reject) => {
            try {
                const app = {
                    assemblies: this.customAssemblies,
                    onAssembliesLoaded: (success) => {
                        if (success) {
                            resolve();
                        } else {
                            reject(new Error('Failed to load assemblies'));
                        }
                    }
                };
                
                BINDING.call_static_method(
                    "[WasmRoslyn]WasmRoslyn.Program:Process",
                    [app]
                );
                
                // Timeout after 30 seconds
                setTimeout(() => {
                    reject(new Error('Assembly loading timeout'));
                }, 30000);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get available assemblies
     * @returns {string[]} List of loaded assemblies
     */
    getAssemblies() {
        return this.customAssemblies;
    }

    /**
     * Set input lines for Console.ReadLine()
     * @param {string[]} lines - Input lines
     */
    setInputLines(lines) {
        this.inputLines = lines;
    }

    /**
     * Get output lines from last execution
     * @returns {string[]} Output lines
     */
    getOutputLines() {
        return this.outputLines;
    }

    /**
     * Get compile log from last compilation
     * @returns {string[]} Compile log lines
     */
    getCompileLog() {
        return this.compileLog;
    }

    // Private helper methods
    _loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script already exists
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.type = 'text/javascript';
            script.onload = () => {
                console.log(`Loaded: ${src}`);
                resolve();
            };
            script.onerror = (error) => {
                console.error(`Failed to load: ${src}`, error);
                reject(new Error(`Failed to load script: ${src}`));
            };
            document.head.appendChild(script);
        });
    }

    _waitForRuntime() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 100; // 10 seconds timeout
            
            const checkRuntime = () => {
                attempts++;
                
                if (typeof BINDING !== 'undefined' && 
                    typeof Module !== 'undefined' && 
                    typeof Module.mono_bind_static_method !== 'undefined') {
                    console.log('Runtime ready');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Timeout waiting for runtime initialization'));
                } else {
                    setTimeout(checkRuntime, 100);
                }
            };
            checkRuntime();
        });
    }

    _initializeCompilerService() {
        // Initialize the C# compiler service
        const app = {
            assemblies: [],
            displayAssemblies: (assemblies) => {
                console.log('Available assemblies:', assemblies);
            }
        };
        
        // Create a dummy outputLog object
        const outputLog = {
            innerHTML: ''
        };
        
        try {
            BINDING.call_static_method(
                "[WasmRoslyn]WasmRoslyn.Program:Main",
                [app, outputLog]
            );
        } catch (error) {
            console.error('Failed to initialize compiler service:', error);
            throw error;
        }
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSharpBrowserCompiler;
} else if (typeof define === 'function' && define.amd) {
    define([], () => CSharpBrowserCompiler);
} else {
    window.CSharpBrowserCompiler = CSharpBrowserCompiler;
}
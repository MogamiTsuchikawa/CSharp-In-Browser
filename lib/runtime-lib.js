// Runtime configuration for library usage
// This file initializes the Module object without calling App.init()

window.Module = window.Module || {
    onRuntimeInitialized: function () {
        if (typeof MONO !== 'undefined' && MONO.mono_load_runtime_and_bcl) {
            MONO.mono_load_runtime_and_bcl(
                config.vfs_prefix,
                config.deploy_prefix,
                config.enable_debugging,
                config.file_list,
                function () {
                    // Runtime is ready, but don't call App.init()
                    // The library will handle initialization
                    console.log('Mono runtime loaded');
                }
            );
        }
    }
};
import plugin from '../plugin.json';

class AcodePlugin {
    public baseUrl: string | undefined;

    async init($page: HTMLElement, cacheFile: any, cacheFileUrl: string): Promise<void> {
        // Add your initialization code here
    }

    async destroy() {
        // Add your cleanup code here
    }
}

if(window.acode) {
    const acodePlugin = new AcodePlugin();
    acode.setPluginInit(plugin.id, async (baseUrl: string, $page: HTMLElement, { cacheFileUrl, cacheFile }: any) => {
        if(!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }
        acodePlugin.baseUrl = baseUrl;
        await acodePlugin.init($page, cacheFile, cacheFileUrl);
    });
    acode.setPluginUnmount(plugin.id, () => {
        acodePlugin.destroy();
    });
}

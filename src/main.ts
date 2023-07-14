//import acode from '../typings/acode';
import plugin from '../plugin.json';

class AcodePlugin {
    public baseUrl: string | undefined;

    async init($page: HTMLElement, cacheFile: any, cacheFileUrl: string) {
        // Add your initialization code here
        window.alert("hi")
    }

    async destroy() {
        // Add your cleanup code here
    }
}

if(window.acode) {
    const acodePlugin = new AcodePlugin();
    acode.setPluginInit(plugin.id, (baseUrl: string, $page: any, { cacheFileUrl, cacheFile }: any) => {
        if(!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }
        acodePlugin.baseUrl = baseUrl;
        acodePlugin.init($page, cacheFile, cacheFileUrl);
    });
    acode.setPluginUnmount(plugin.id, () => {
        acodePlugin.destroy();
    });
}

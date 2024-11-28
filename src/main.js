import plugin from '../plugin.json';
//this is the main acode class
class AcodePlugin {
//acode initinalization
  async init() {
    //your code
  }

  async destroy() {
  //what happens on destroy
  }
}
//the geature before we load the plugin
if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init($page, cacheFile, cacheFileUrl);
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}

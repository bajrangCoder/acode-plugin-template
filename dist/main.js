var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// plugin.json
var plugin_default;
var init_plugin = __esm({
  "plugin.json"() {
    plugin_default = {
      id: "com.examaple.plugin",
      name: "Plugin",
      main: "dist/main.js",
      version: "1.0.0",
      readme: "readme.md",
      icon: "icon.png",
      files: [],
      price: 0,
      minVersionCode: 290,
      author: {
        name: "",
        email: "",
        url: "https://superninjax2.alwaysdata.net",
        github: ""
      }
    };
  }
});

// src/main.js
var require_main = __commonJS({
  "src/main.js"(exports) {
    init_plugin();
    var fs = acode.require("fs");
    var AcodePlugin = class {
      init() {
        return __async(this, null, function* () {
          const filesystem = yield fs(url);
          console.log(filesystem);
          console.log("hello");
        });
      }
      destroy() {
        return __async(this, null, function* () {
        });
      }
    };
    if (window.acode) {
      const acodePlugin = new AcodePlugin();
      acode.setPluginInit(plugin_default.id, (_0, _1, _2) => __async(exports, [_0, _1, _2], function* (baseUrl, $page, { cacheFileUrl, cacheFile }) {
        if (!baseUrl.endsWith("/")) {
          baseUrl += "/";
        }
        acodePlugin.baseUrl = baseUrl;
        yield acodePlugin.init($page, cacheFile, cacheFileUrl);
      }));
      acode.setPluginUnmount(plugin_default.id, () => {
        acodePlugin.destroy();
      });
    }
  }
});
export default require_main();

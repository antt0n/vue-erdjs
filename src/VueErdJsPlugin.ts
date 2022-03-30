import type {App} from "vue";
import {Transaction, Address, ApiProvider, NetworkConfig, ProxyProvider} from "@elrondnetwork/erdjs";
import Providers from "./providers/Providers";
import Components, { VueErdjsConnect } from "./components";
import providerConfig, {ElrondEnvEnum, ProviderOption} from "./providers/config";
import VueErdJs from "./VueErdJs";

export { ProviderOption, ElrondEnvEnum, VueErdjsConnect }
export default {
    install: (app: App, options?: ProviderOption) => {
        if(!options) {
            options = providerConfig(ElrondEnvEnum.DEVNET);
        }
        const erdApi = new ApiProvider(options.api.url, {timeout: options.api.timeout});
        const erdProxy = new ProxyProvider(options.proxy.url, {timeout: options.proxy.timeout});
    
        NetworkConfig.getDefault().sync(erdProxy);
        const providers = new Providers(erdProxy, erdApi, options,
            (address: Address, token?: string) => {
                app.config.globalProperties.$erd.walletAddress = address;
                if (token) {
                    app.config.globalProperties.$erd.token = token;
                }
            },
            () => {
                app.config.globalProperties.$erd.walletAddress = null;
                app.config.globalProperties.$erd.token = null;
            },
            (transaction: Transaction) => {
                /*app.$emits('transaction', transaction);*/
                console.log("noice")
            });
    
        const vueErdJs = new VueErdJs(app, providers, options.explorer.url);
                    
        //app.config.globalProperties.$erd = vueErdJs;
        app.provide("$erd", VueErdJs)
        app.provide("$erdApi", erdApi)
        app.provide("$erdProxy", erdProxy)

        /*
        mixin method not recommended with Vue 3 accorded to the documentation.
        https://vuejs.org/api/application.html#app-mixin
        */
        app.mixin({
            setup() {
                vueErdJs.providers.init();
            },
            onBeforeMount() {
                vueErdJs.providers.onUrl(window.location);
            }
        })
    
        for (const component of Components) {
            app.component(component.name, component)
        }

    }
}
import type { Transaction } from "@elrondnetwork/erdjs";
import type Providers from "./providers/Providers";
import type { App } from "vue";

export default class VueErdJs {
    private _app: App;
    private _providers: Providers;
    private _explorerUrl: string;

    constructor(app: App, providers: Providers, explorerUrl: string) {
        this._app = app;
        this._providers = providers;
        this._explorerUrl = explorerUrl;
    }

    get logged() {
        return this._app.config.globalProperties.$erd.logged;
    }

    get walletAddress() {
        return this._app.config.globalProperties.$erd.walletAddress;
    }

    get token() {
        return this._app.config.globalProperties.$erd.token;
    }

    get obfuscatedWalletAddress() {
        if (!this.walletAddress || this.walletAddress.isEmpty()) {
            return undefined;
        }
        const keepNbChar = 6;
        return this.walletAddress.bech32().slice(0, keepNbChar) +
            '...' +
            this.walletAddress.bech32().slice(-keepNbChar);
    }

    get maiarApp() {
        return this._providers.maiarApp;
    }

    get ledger() {
        return this._providers.ledger;
    }

    get webWallet() {
        return this._providers.webWallet;
    }

    get defiWallet() {
        return this._providers.defiWallet;
    }

    get providers() {
        return this._providers;
    }

    get proxy() {
        return this.providers.proxy;
    }

    get api() {
        return this.providers.api;
    }

    logout() {
        this.providers.logout();
    }

    explorerTransactionUrl(transaction: Transaction) {
        return `${this._explorerUrl}/transactions/${transaction.getHash()}`;
    }
    /*
    $on(event: string | string[], callback: Function): Vue.App {
        return this._store.$on(event, callback);
    }

    $once(event: string | string[], callback: Function): Vue.App {
        return this._store.$once(event, callback);
    }

    $off(event?: string | string[], callback?: Function): Vue.App {
        return this._store.$off(event, callback);
    }
    */
}


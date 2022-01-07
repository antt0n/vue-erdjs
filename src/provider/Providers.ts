import MaiarAppStrategy from './maiar-app/MaiarAppStrategy';
import LedgerStrategy from './ledger/LedgerStrategy';
import WebWalletStrategy from './web/web-wallet';
import {Address, ProxyProvider, Transaction} from "@elrondnetwork/erdjs";
import {ProviderOption} from "./config";
import IProviderStrategyEventHandler from "./IProviderStrategyEventHandler";
import IProviderStrategy from "./IProviderStrategy";

const PROVIDER_STRATEGY_STORAGE="vue-erdjs-strategy";

class Providers implements IProviderStrategyEventHandler {
  currentStrategy?: IProviderStrategy;
  private onLogin: Function;
  private onLogout: Function;
  private _maiarApp: MaiarAppStrategy;
  private _ledger: LedgerStrategy;
  private _webWallet: WebWalletStrategy;
  private initialised: boolean;

  constructor(proxy: ProxyProvider, options: ProviderOption, onLogin: Function, onLogout: Function) {
    this.currentStrategy = undefined;
    this.onLogin = onLogin;
    this.onLogout = onLogout;
    this._maiarApp = new MaiarAppStrategy(this, proxy, options.maiar);
    this._ledger = new LedgerStrategy(this, proxy, options.ledger);
    this._webWallet = new WebWalletStrategy(this, options.webWallet);
    this.initialised = false;
  }


  async init() {
    if (!window || this.initialised) return;

    this.initialised = true;

    let strategyStorage = window.localStorage.getItem(PROVIDER_STRATEGY_STORAGE);
    if(!strategyStorage) return;

    let strategy = JSON.parse(strategyStorage);
    let storedStrategy;
    if (strategy.name === this.maiarApp.name) {
      storedStrategy = this.maiarApp;
    } else if (strategy.name === this.ledger.name) {
      storedStrategy = this.ledger;
    } else if(strategy.name === this.webWallet.name) {
      storedStrategy = this.webWallet
    }

    if(storedStrategy) {
      storedStrategy.load();
    }
  }

  sendTransaction(transaction: Transaction) {
    if (this.currentStrategy === undefined) {
      return Promise.reject(new Error("No strategy available"));
    }
    console.log("Current provider", this.currentStrategy.provider);
    return this.currentStrategy.provider().sendTransaction(transaction);
  }

  get provider() {
    if (this.currentStrategy === undefined) {
      return undefined;
    }
    return this.currentStrategy.provider;
  }

  get ledger() {
    return this._ledger;
  }

  get maiarApp() {
    return this._maiarApp;
  }

  get webWallet() {
    return this._webWallet;
  }

  logout() {
    if(this.currentStrategy) {
      this.currentStrategy.logout();
      this.handleLogout(this.currentStrategy);
    }
  }

  handleLoginStart(provider: IProviderStrategy) {
    console.log("Login start", provider);
  }

  handleLogin(provider: IProviderStrategy, address: Address) {
    console.log("Login", provider, address);
    window.localStorage.setItem(PROVIDER_STRATEGY_STORAGE, JSON.stringify({ name: provider.name() }));
    this.currentStrategy = provider;
    this.onLogin(address);
  }

  handleLoginError(provider: IProviderStrategy, err: Error) {
    console.log("Login error", provider, err);
    this.handleLogout(provider);
  }

  handleLogout(provider: IProviderStrategy) {
    console.log("Logout", provider);
    window.localStorage.removeItem(PROVIDER_STRATEGY_STORAGE);
    this.currentStrategy = undefined;
    this.onLogout();
  }

}

export default Providers;
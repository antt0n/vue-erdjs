import IProviderStrategy from "./IProviderStrategy";
import { Address } from "@elrondnetwork/erdjs";
interface IProviderStrategyEventHandler {
    handleLogin(provider: IProviderStrategy, address: Address): void;
    handleLoginStart(provider: IProviderStrategy): void;
    handleLoginError(provider: IProviderStrategy, err: Error): void;
    handleLogout(provider: IProviderStrategy): void;
}
export default IProviderStrategyEventHandler;
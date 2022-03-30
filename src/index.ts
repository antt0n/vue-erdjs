import VueErdJsPlugin, { ProviderOption, ElrondEnvEnum, VueErdjsConnect } from "./VueErdJsPlugin";
import { providersOptions } from "./providers/Providers";
import type * as qrcode from "./components/maiar/IQRCodeHandler";

export type IQRCodeHandler = qrcode.IQRCodeHandler;
export {  ProviderOption, VueErdjsConnect, ElrondEnvEnum, providersOptions }
export default VueErdJsPlugin;

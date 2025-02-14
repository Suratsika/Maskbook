import type { JsonRpcPayload, JsonRpcResponse } from './types'

/**
 * APIs that both Android and iOS implements and have the same API signature
 */
export interface SharedNativeAPIs {
    /**
     * Send Ethereum JSON RPC
     */
    send(payload: JsonRpcPayload): Promise<JsonRpcResponse>
}
/**
 * APIs that only implemented by iOS Mask Network
 */
export interface iOSNativeAPIs extends SharedNativeAPIs {
    /**
     * Open a full screen QR Code scanner.
     * @returns The scan result
     */
    scanQRCode(): Promise<string>
}
/**
 * APIs that only implemented by Android Mask Network
 */
export interface AndroidNativeAPIs extends SharedNativeAPIs {}

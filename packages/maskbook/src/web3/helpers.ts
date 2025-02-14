import Services from '../extension/service'

export function createExternalProvider() {
    return {
        isMetaMask: false,
        isMask: true,
        isStatus: true,
        host: '',
        path: '',
        sendAsync: Services.Ethereum.requestSend,
        send: Services.Ethereum.requestSend,
        request: Services.Ethereum.request,
    }
}

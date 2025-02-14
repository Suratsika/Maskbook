import { safeUnreachable } from '@dimensiondev/kit'
import { getNetworkTypeFromChainId, NetworkType } from '@masknet/web3-shared'
import { currentChainIdSettings } from '../../../Wallet/settings'
import { TagType, TradeProvider } from '../../types'

export async function getAvailableTraderProviders(type?: TagType, keyword?: string) {
    const networkType = getNetworkTypeFromChainId(currentChainIdSettings.value)
    if (!networkType) return []
    switch (networkType) {
        case NetworkType.Ethereum:
            return [
                TradeProvider.UNISWAP_V2,
                TradeProvider.UNISWAP_V3,
                TradeProvider.SUSHISWAP,
                TradeProvider.SASHIMISWAP,
                TradeProvider.ZRX,
                TradeProvider.BALANCER,
                TradeProvider.DODO,
            ]
        case NetworkType.Polygon:
            return [TradeProvider.QUICKSWAP, TradeProvider.SUSHISWAP, TradeProvider.DODO, TradeProvider.ZRX]
        case NetworkType.Binance:
            return [TradeProvider.PANCAKESWAP, TradeProvider.SUSHISWAP, TradeProvider.DODO, TradeProvider.ZRX]
        case NetworkType.Arbitrum:
            return [TradeProvider.UNISWAP_V3]
        default:
            safeUnreachable(networkType)
            return []
    }
}

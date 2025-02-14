import type BigNumber from 'bignumber.js'
import type { ChainId, FungibleTokenDetailed, NativeTokenDetailed, ERC20TokenDetailed } from '@masknet/web3-shared'
import type { TradeProvider } from '@masknet/public-api'

export { TradeProvider } from '@masknet/public-api'

export enum WarningLevel {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    CONFIRMATION_REQUIRED = 4,
    BLOCKED = 5,
}

// ZRX supported source swap list
// Learn more https://github.com/0xProject/0x-monorepo/blob/development/packages/asset-swapper/src/utils/market_operation_utils/types.ts#L27
export enum ZrxTradePool {
    ZRX = '0x',
    Native = 'Native',
    Mesh = 'Mesh',
    Uniswap = 'Uniswap',
    UniswapV2 = 'Uniswap_V2',
    UniswapV3 = 'Uniswap_V3',
    Eth2Dai = 'Eth2Dai',
    Kyber = 'Kyber',
    Curve = 'Curve',
    CurveV2 = 'Curve_V2',
    LiquidityProvider = 'LiquidityProvider',
    MultiBridge = 'MultiBridge',
    Balancer = 'Balancer',
    BalancerV2 = 'Balancer_V2',
    Dodo = 'DODO',
    DodoV2 = 'DODO_V2',
    Linkswap = 'Linkswap',
    Lido = 'Lido',
    MakerPsm = 'MakerPsm',
    KyberDMM = 'KyberDMM',
    Smoothy = 'Smoothy',
    Saddle = 'Saddle',
    xSigma = 'xSigma',
    Cream = 'CREAM',
    Bancor = 'Bancor',
    MStable = 'mStable',
    Mooniswap = 'Mooniswap',
    MultiHop = 'MultiHop',
    Shell = 'Shell',
    Swerve = 'Swerve',
    SnowSwap = 'SnowSwap',
    SushiSwap = 'SushiSwap',
    CryptoCom = 'CryptoCom',
}

export interface TradeComputed<T = unknown> {
    strategy: TradeStrategy
    inputToken?: FungibleTokenDetailed
    outputToken?: FungibleTokenDetailed
    inputAmount: BigNumber
    outputAmount: BigNumber
    executionPrice: BigNumber
    priceImpact: BigNumber
    maximumSold: BigNumber
    minimumReceived: BigNumber
    fee: BigNumber
    path?: (PartialRequired<NativeTokenDetailed, 'address'> | PartialRequired<ERC20TokenDetailed, 'address'>)[][]
    trade_?: T
}

export enum TradeStrategy {
    ExactIn = 0,
    ExactOut = 1,
}

export enum TokenPanelType {
    Input = 0,
    Output = 1,
}

export interface TradeContext {
    TYPE: TradeProvider
    IS_UNISWAP_V2_LIKE?: boolean
    IS_UNISWAP_V3_LIKE?: boolean
    GRAPH_API?: string
    INIT_CODE_HASH?: string
    ROUTER_CONTRACT_ADDRESS?: string
    FACTORY_CONTRACT_ADDRESS?: string
    ADDITIONAL_TOKENS?: {
        [key in ChainId]?: Record<string, ERC20TokenDetailed[]>
    }
    AGAINST_TOKENS?: {
        [key in ChainId]?: ERC20TokenDetailed[]
    }
    CUSTOM_TOKENS?: {
        [key in ChainId]?: Record<string, ERC20TokenDetailed[]>
    }
}

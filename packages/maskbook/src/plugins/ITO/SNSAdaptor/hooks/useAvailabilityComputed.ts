import { useState } from 'react'
import { useInterval } from 'react-use'
import { compact } from 'lodash-es'
import { useChainId, useITOConstants } from '@masknet/web3-shared'
import { JSON_PayloadInMask, ITO_Status } from '../../types'
import { useAvailability } from './useAvailability'
import { useQualification } from './useQualification'
import { ITO_CONTRACT_BASE_TIMESTAMP } from '../../constants'

export function useAvailabilityComputed(payload: JSON_PayloadInMask) {
    const chainId = useChainId()
    const { DEFAULT_QUALIFICATION2_ADDRESS } = useITOConstants()
    let asyncResult = useAvailability(payload.pid, payload.contract_address)
    const { value: availability, loading: loadingITO } = asyncResult
    const qualificationAddress =
        payload.qualification_address ?? availability?.qualification_addr ?? DEFAULT_QUALIFICATION2_ADDRESS
    const { value: qualification_start_time, loading: loadingQual } = useQualification(
        qualificationAddress,
        payload.contract_address,
    )
    asyncResult.loading = loadingITO || loadingQual
    //#region ticker
    const [_, setTicker] = useState(0)
    useInterval(() => setTicker((x) => x + 1), 1000)
    //#endregion

    if (!availability || qualification_start_time === undefined)
        return {
            ...asyncResult,
            payload,
            computed: {
                remaining: '0',
                startTime: 0,
                endTime: 0,
                canFetch: false,
                canSwap: false,
                canShare: false,
                canRefund: false,
                isUnlocked: false,
                hasLockTime: false,
                unlockTime: 0,
                qualificationAddress,
                listOfStatus: compact([availability?.expired ? ITO_Status.expired : undefined]) as ITO_Status[],
            },
        }
    const _startTime = payload.start_time ? payload.start_time : Number(availability.start_time) * 1000
    const endTime = payload.end_time ? payload.start_time : Number(availability.end_time) * 1000
    const startTime = qualification_start_time > _startTime ? qualification_start_time : _startTime
    const isStarted = startTime < Date.now()
    const isExpired = availability.expired
    const unlockTime = Number(availability.unlock_time) * 1000
    const hasLockTime = unlockTime !== ITO_CONTRACT_BASE_TIMESTAMP
    const isCompleted = Number(availability.swapped) > 0

    return {
        ...asyncResult,
        computed: {
            remaining: availability.remaining,
            startTime,
            endTime,
            unlockTime,
            qualificationAddress,
            hasLockTime,
            isUnlocked: availability.unlocked,
            canFetch: payload.chain_id === chainId,
            canSwap: isStarted && !isExpired && !isCompleted && payload.chain_id === chainId && payload.password,
            canRefund: isExpired && payload.chain_id === chainId,
            canShare: !isStarted,
            listOfStatus: compact([
                isStarted ? ITO_Status.started : ITO_Status.waited,
                isExpired ? ITO_Status.expired : undefined,
            ]),
        },
    }
}

import { useResolveENS, useResolveUNS } from '@masknet/web3-shared'
import { useEffect, useMemo, useState } from 'react'

const ENS_RE = /[\w#%+.:=@~-]{1,256}\.(eth|kred|xyz|luxe)\b/
const ENS_RE_FULL = new RegExp(`^${ENS_RE.source}$`)
const ADDRESS = /0x[\dA-Fa-f]{40}/

export function useEthereumName(nickname: string, twitterId: string, bio: string) {
    const [ethereumName, setEthereumName] = useState('')

    useEffect(() => {
        setEthereumName('')
        const matched = bio.match(ENS_RE)
        if (matched) {
            setEthereumName(matched[0])
        }
    }, [bio])
    const name = useMemo(() => {
        if (ENS_RE_FULL.test(nickname)) {
            return nickname
        }
        if (ethereumName) return ethereumName
        return twitterId ? `${twitterId}.eth` : ''
    }, [ethereumName, nickname, twitterId])

    return name
}

export function useEthereumAddress(nickanme: string, twitterId: string, bio: string) {
    const [address, setAddress] = useState<string | undefined>()
    const name = useEthereumName(nickanme, twitterId, bio)
    const addressENS = useResolveENS(name).value
    const addressUNS = useResolveUNS(name).value

    useEffect(() => {
        setAddress('')
        const matched = bio.match(ADDRESS)
        if (matched) setAddress(matched[0])
    }, [bio])

    return {
        name,
        addressENS,
        addressUNS,
        address,
    }
}

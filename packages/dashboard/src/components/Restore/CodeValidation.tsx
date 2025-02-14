import { memo } from 'react'
import { fetchDownloadLink } from '../../pages/Settings/api'
import { useAsyncFn } from 'react-use'
import { Step, Stepper } from '../Stepper'
import { ConfirmBackupInfo } from './steps/ConfirmBackupInfo'
import { EmailField } from './steps/EmailField'
import { PhoneField } from './steps/PhoneField'
import { LoadingCard } from './steps/LoadingCard'
import { ValidationAccount } from './steps/ValidationAccount'
import { ValidationCodeStep } from './steps/Commont'
import type { AccountValidationType } from '../../pages/Settings/type'

interface CodeValidationProps {
    onValidated(downloadLink: string, account: string, password: string): Promise<string | null>
}

export const CodeValidation = memo(({ onValidated }: CodeValidationProps) => {
    const [{ loading: fetchingBackupInfo }, fetchDownloadLinkFn] = useAsyncFn(
        async (account: string, type: AccountValidationType, code: string) => {
            return fetchDownloadLink({ code, account, type })
        },
        [],
    )

    return (
        <Stepper
            defaultStep={ValidationCodeStep.EmailInput}
            transition={{ render: <LoadingCard />, trigger: fetchingBackupInfo }}>
            <Step name={ValidationCodeStep.EmailInput}>{(toStep) => <EmailField toStep={toStep} />}</Step>
            <Step name={ValidationCodeStep.PhoneInput}>{(toStep) => <PhoneField toStep={toStep} />}</Step>
            <Step name={ValidationCodeStep.AccountValidation}>
                {(toStep, { account, type }) => (
                    <ValidationAccount toStep={toStep} account={account} type={type} onNext={fetchDownloadLinkFn} />
                )}
            </Step>
            <Step name={ValidationCodeStep.ConfirmBackupInfo}>
                {(toStep, { backupInfo, account }) => (
                    <ConfirmBackupInfo toStep={toStep} backupInfo={backupInfo} account={account} onNext={onValidated} />
                )}
            </Step>
        </Stepper>
    )
})

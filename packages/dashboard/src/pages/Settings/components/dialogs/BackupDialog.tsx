import { useContext, useMemo, useState, useEffect } from 'react'
import { PluginServices, Services } from '../../../../API'
import { useAsync, useAsyncFn } from 'react-use'
import BackupContentSelector, { BackupContentCheckedStatus } from '../BackupContentSelector'
import { useDashboardI18N } from '../../../../locales'
import { MaskDialog, MaskTextField, useSnackbar } from '@masknet/theme'
import { Box } from '@material-ui/core'
import { UserContext } from '../../hooks/UserContext'
import LoadingButton from '@material-ui/lab/LoadingButton'
import { VerifyCodeRequest, fetchUploadLink, uploadBackupValue } from '../../api'
import formatDateTime from 'date-fns/format'
import { LoadingCard } from '../../../../components/Restore/steps/LoadingCard'

export interface BackupDialogProps {
    local?: boolean
    params?: VerifyCodeRequest
    open: boolean
    onClose(): void
}

export default function BackupDialog({ local = true, params, open, onClose }: BackupDialogProps) {
    const snackbar = useSnackbar()
    const t = useDashboardI18N()
    const [backupPassword, setBackupPassword] = useState('')
    const [paymentPassword, setPaymentPassword] = useState('')
    const [incorrectBackupPassword, setIncorrectBackupPassword] = useState(false)
    const [incorrectPaymentPassword, setIncorrectPaymentPassword] = useState(false)
    const [showPassword, setShowPassword] = useState({
        base: true,
        wallet: false,
    })
    const title = local ? t.settings_local_backup() : t.settings_cloud_backup()
    const { user, updateUser } = useContext(UserContext)

    const { value: previewInfo, loading: searching } = useAsync(() => Services.Welcome.generateBackupPreviewInfo())

    const [{ loading }, handleBackup] = useAsyncFn(async () => {
        if (backupPassword !== user.backupPassword) {
            setIncorrectBackupPassword(true)
            return
        }

        if (showPassword.wallet) {
            // for test
            // await PluginServices.Wallet.createEncryptedWalletStore(paymentPassword)
            const result = await PluginServices.Wallet.decryptWallet(paymentPassword)
            if (!result.ok) {
                setIncorrectPaymentPassword(true)
                return
            }
        }

        try {
            const file = await Services.Welcome.createBackupFile({
                noPosts: !showPassword.base,
                noPersonas: !showPassword.base,
                noProfiles: !showPassword.base,
                noWallets: !showPassword.wallet,
                download: local,
                onlyBackupWhoAmI: false,
            })

            if (!local && params) {
                const abstract = file.personas
                    .filter((x) => x.nickname)
                    .map((x) => x.nickname)
                    .join(', ')
                const uploadUrl = await fetchUploadLink({ ...params, abstract })
                const encrypted = await Services.Crypto.encryptBackup(
                    backupPassword,
                    params.account,
                    JSON.stringify(file),
                )

                uploadBackupValue(uploadUrl, encrypted).then(() => {
                    snackbar.enqueueSnackbar(t.settings_alert_backup_success(), { variant: 'success' })
                })
            }

            updateUser({
                backupMethod: local ? 'local' : 'cloud',
                backupAt: formatDateTime(new Date(), 'yyyy-MM-dd HH:mm'),
            })

            onClose()
        } catch {
            snackbar.enqueueSnackbar(t.settings_alert_backup_fail(), { variant: 'error' })
        }
    }, [backupPassword, paymentPassword])

    const handleContentChange = ({ baseChecked, walletChecked }: BackupContentCheckedStatus) => {
        setShowPassword({
            base: baseChecked,
            wallet: walletChecked,
        })
    }

    const backupDisabled = useMemo(() => {
        return !backupPassword || (showPassword.wallet && !paymentPassword) || loading
    }, [backupPassword, paymentPassword, loading])

    useEffect(() => {
        setIncorrectBackupPassword(false)
    }, [backupPassword])

    useEffect(() => {
        setIncorrectPaymentPassword(false)
    }, [paymentPassword])

    return (
        <MaskDialog maxWidth="xs" title={title} open={open} onClose={onClose}>
            {searching ? (
                <Box sx={{ padding: '0 24px 24px' }}>
                    <LoadingCard text={t.searching()} />
                </Box>
            ) : (
                <Box sx={{ padding: '0 24px 24px' }}>
                    {previewInfo ? <BackupContentSelector json={previewInfo} onChange={handleContentChange} /> : null}

                    <MaskTextField
                        fullWidth
                        value={backupPassword}
                        onChange={(event) => setBackupPassword(event.target.value)}
                        type="password"
                        placeholder={t.settings_label_backup_password()}
                        sx={{ marginBottom: '24px' }}
                        error={incorrectBackupPassword}
                        helperText={incorrectBackupPassword ? t.settings_dialogs_incorrect_password() : ''}
                    />

                    {showPassword.wallet ? (
                        <MaskTextField
                            fullWidth
                            value={paymentPassword}
                            onChange={(event) => setPaymentPassword(event.target.value)}
                            type="password"
                            placeholder={t.settings_label_payment_password()}
                            sx={{ marginBottom: '24px' }}
                            error={incorrectPaymentPassword}
                            helperText={incorrectPaymentPassword ? t.settings_dialogs_incorrect_password() : ''}
                        />
                    ) : null}

                    <LoadingButton fullWidth disabled={backupDisabled} onClick={handleBackup} loading={loading}>
                        {t.settings_button_backup()}
                    </LoadingButton>
                </Box>
            )}
        </MaskDialog>
    )
}

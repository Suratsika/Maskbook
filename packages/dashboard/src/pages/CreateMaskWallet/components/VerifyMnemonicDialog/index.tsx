import { memo } from 'react'
import { Box, makeStyles, Typography, experimentalStyled as styled, Button } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import { MaskDialog } from '@masknet/theme'
import { SuccessIcon } from '@masknet/icons'
import { DesktopMnemonicConfirm } from '../../../../components/Mnemonic'
import { useDashboardI18N } from '../../../../locales'

const useStyles = makeStyles((theme) => ({
    container: {
        padding: '40px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        lineHeight: 1.25,
    },
    confirm: {
        marginTop: 24,
    },
    button: {
        height: 48,
        borderRadius: 24,
        fontSize: 18,
        marginTop: 50,
    },
}))

const SuccessTitle = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.h5.fontSize,
    color: theme.palette.success.main,
    fontWeight: theme.typography.fontWeightMedium,
    margin: theme.spacing(2, 0),
}))

export interface VerifyMnemonicDialogProps {
    matched: boolean
    open: boolean
    onClose: () => void
    puzzleWords: string[]
    indexes: number[]
    onUpdateAnswerWords: (word: string, index: number) => void
    onSubmit: () => void
    address?: string
    loading: boolean
}

export const VerifyMnemonicDialog = memo<VerifyMnemonicDialogProps>(
    ({ matched, open, onClose, puzzleWords, indexes, onUpdateAnswerWords, onSubmit, loading, address }) => {
        const t = useDashboardI18N()
        const classes = useStyles()

        return (
            <MaskDialog title="Verification" open={open} onClose={onClose} maxWidth="md">
                <div className={classes.container}>
                    {address ? (
                        <>
                            <SuccessIcon sx={{ fontSize: 54 }} />
                            <SuccessTitle>{t.wallets_create_successfully_title()}</SuccessTitle>
                            <Button fullWidth className={classes.button}>
                                Done
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography className={classes.title}>Verify Mnemonic words</Typography>
                            <Box className={classes.confirm}>
                                <DesktopMnemonicConfirm
                                    indexes={indexes}
                                    words={puzzleWords}
                                    onUpdateAnswerWords={onUpdateAnswerWords}
                                />
                            </Box>
                            <LoadingButton
                                loading={loading}
                                fullWidth
                                className={classes.button}
                                disabled={!matched}
                                onClick={onSubmit}>
                                Verify
                            </LoadingButton>
                        </>
                    )}
                </div>
            </MaskDialog>
        )
    },
)

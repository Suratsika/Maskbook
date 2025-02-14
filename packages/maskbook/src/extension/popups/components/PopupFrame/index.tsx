import { memo } from 'react'
import { Box, Paper, GlobalStyles } from '@material-ui/core'
import { makeStyles } from '@masknet/theme'
import { ArrowBackIcon, MiniMaskIcon } from '@masknet/icons'
import { NavLink, useHistory, useRouteMatch } from 'react-router-dom'
import { PopupRoutes } from '../../index'
import { useMyPersonas } from '../../../../components/DataSource/useMyPersonas'
import { InitialPlaceholder } from '../InitialPlaceholder'
import { useI18N } from '../../../../utils'

function GlobalCss() {
    return (
        <GlobalStyles
            styles={{
                body: {
                    overflowX: 'hidden',
                    margin: '0 auto',
                    width: 310,
                    maxWidth: '100%',
                    backgroundColor: 'transparent',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                },
            }}
        />
    )
}

const useStyles = makeStyles()((theme) => ({
    container: {
        height: 474,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        padding: '0px 10px',
        backgroundColor: theme.palette.primary.main,
        height: 40,
        display: 'flex',
        justifyContent: 'space-between',
    },
    left: {
        display: 'flex',
        alignItems: 'center',
    },
    right: {
        display: 'flex',
        paddingTop: 6,
    },
    nav: {
        width: 86,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: '4px 4px 0px 0px',
        fontSize: 14,
        fontWeight: 500,
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
    },
    active: {
        color: theme.palette.primary.main,
        cursor: 'inherit',
        backgroundColor: '#ffffff',
    },
}))

export interface PopupFrameProps extends React.PropsWithChildren<{}> {}

export const PopupFrame = memo<PopupFrameProps>((props) => {
    const { t } = useI18N()
    const history = useHistory()
    const { classes } = useStyles()
    const personas = useMyPersonas()

    const excludePath = useRouteMatch({
        path: [PopupRoutes.Wallet, PopupRoutes.Personas, PopupRoutes.GasSetting, PopupRoutes.WalletSignRequest],
        exact: true,
    })

    return (
        <>
            <GlobalCss />
            <Paper elevation={0}>
                <Box className={classes.header}>
                    <Box className={classes.left}>
                        {excludePath || history.length > 1 ? (
                            <MiniMaskIcon />
                        ) : (
                            <ArrowBackIcon onClick={history.goBack} style={{ fill: '#ffffff', cursor: 'pointer' }} />
                        )}
                    </Box>
                    <Box className={classes.right}>
                        <NavLink
                            style={{ marginRight: 5 }}
                            to={PopupRoutes.Wallet}
                            className={classes.nav}
                            activeClassName={classes.active}>
                            {t('wallets')}
                        </NavLink>
                        <NavLink to={PopupRoutes.Personas} className={classes.nav} activeClassName={classes.active}>
                            {t('personas')}
                        </NavLink>
                    </Box>
                </Box>
                <Box className={classes.container}>
                    {personas.length === 0 ? <InitialPlaceholder /> : props.children}
                </Box>
            </Paper>
        </>
    )
})

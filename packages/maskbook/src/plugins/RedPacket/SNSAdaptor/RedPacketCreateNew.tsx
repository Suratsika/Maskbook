import { makeStyles } from '@material-ui/core/styles'
import type { Theme } from '@material-ui/core'
import { useState } from 'react'
import { RedPacketFormProps, RedPacketForm } from './RedPacketForm'
import AbstractTab, { AbstractTabProps } from '../../../components/shared/AbstractTab'
import { useI18N } from '../../../utils'
import { RpTypeTabs } from '../types'
import { IconURLs } from './IconURL'

const useStyles = makeStyles((theme: Theme) => ({
    tab: {
        height: 36,
        minHeight: 36,
        fontWeight: 300,
        color: theme.palette.mode === 'light' ? '#15181B' : '#D9D9D9',
    },
    tabs: {
        backgroundColor: theme.palette.mode === 'light' ? '#F7F9FA' : '#17191D',
        width: 520,
        height: 36,
        minHeight: 36,
        margin: '0 auto',
        '& .Mui-selected': {
            backgroundColor: '#1C68F3',
            color: '#fff',
        },
        borderRadius: 4,
    },
    indicator: {
        display: 'none',
    },
    tabPanel: {
        marginTop: theme.spacing(3),
    },
    img: {
        width: 20,
        marginRight: 4,
    },
    labelWrapper: {
        display: 'flex',
    },
}))

export function RedPacketCreateNew(props: RedPacketFormProps) {
    const { origin, onNext, onChange, SelectMenuProps } = props
    const { t } = useI18N()
    const classes = useStyles()
    const state = useState(RpTypeTabs.ERC20)

    const tabProps: AbstractTabProps = {
        tabs: [
            {
                label: (
                    <div className={classes.labelWrapper}>
                        <img className={classes.img} src={IconURLs.erc20Token} />
                        <span>{t('plugin_red_packet_erc20_tab_title')}</span>
                    </div>
                ),
                children: (
                    <RedPacketForm
                        origin={origin}
                        onNext={onNext}
                        onChange={onChange}
                        SelectMenuProps={SelectMenuProps}
                    />
                ),
                sx: { p: 0 },
                disableFocusRipple: true,
                disableRipple: true,
            },
            {
                label: (
                    <div className={classes.labelWrapper}>
                        <img className={classes.img} src={IconURLs.erc721Token} />
                        <span>{t('plugin_red_packet_erc721_tab_title')}</span>
                    </div>
                ),
                children: <div />,
                sx: { p: 0 },
                disableFocusRipple: true,
                disableRipple: true,
            },
        ],
        state,
        classes,
    }
    return <AbstractTab height={420} {...tabProps} />
}

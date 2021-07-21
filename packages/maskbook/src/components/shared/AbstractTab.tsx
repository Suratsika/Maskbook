import { makeStyles } from '@material-ui/core/styles'
import { Theme, Tabs, Tab, Box, BoxProps, Paper } from '@material-ui/core'
import { useStylesExtends } from '../custom-ui-helper'

const useStyles = makeStyles((theme: Theme) => ({
    tab: {
        minWidth: 'unset',
    },
    tabPanel: {
        marginTop: theme.spacing(3),
    },
}))

interface TabPanelProps extends BoxProps {
    id?: string
    label: string | React.ReactNode
    disableFocusRipple?: boolean
    disableRipple?: boolean
}

export interface AbstractTabProps extends withClasses<'tab' | 'tabs' | 'tabPanel' | 'indicator'> {
    tabs: Omit<TabPanelProps, 'height' | 'minHeight'>[]
    state: readonly [number, (next: number) => void]
    margin?: true | 'top' | 'bottom'
    height?: number | string
}

export default function AbstractTab(props: AbstractTabProps) {
    const { tabs, state, height = 200 } = props
    const classes = useStylesExtends(useStyles(), props)
    const [value, setValue] = state
    const tabIndicatorStyle = tabs.length ? { width: 100 / tabs.length + '%' } : undefined

    return (
        <>
            <Paper square elevation={0}>
                <Tabs
                    className={classes.tabs}
                    classes={{
                        indicator: classes.indicator,
                    }}
                    value={value}
                    TabIndicatorProps={{ style: tabIndicatorStyle }}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(_: React.SyntheticEvent, newValue: number) => setValue(newValue)}>
                    {tabs.map((tab, i) => (
                        <Tab
                            className={classes.tab}
                            disableFocusRipple={tab.disableFocusRipple}
                            disableRipple={tab.disableRipple}
                            label={tab.label}
                            key={i}
                            data-testid={`${tab.id?.toLowerCase()}_tab`}
                        />
                    ))}
                </Tabs>
            </Paper>
            <Box
                className={classes.tabPanel}
                role="tabpanel"
                {...tabs.find((_, index) => index === value)}
                sx={{
                    height: height,
                    minHeight: height,
                }}
            />
        </>
    )
}

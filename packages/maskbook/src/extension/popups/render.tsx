import { lazy, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { HashRouter } from 'react-router-dom'
import { MaskUIRoot } from '../../UIRoot'
import { PopupRoutes } from '.'
import { createNormalReactRoot } from '../../utils'
import '../../social-network-adaptor/browser-action'

import { Web3Provider } from '@masknet/web3-shared'
import { Web3Context } from '../../web3/context'
import { PopupFrame } from './components/PopupFrame'

const Wallet = lazy(() => import('./pages/Wallet'))
const Personas = lazy(() => import('./pages/Personas'))
const RequestPermissionPage = lazy(() => import('./RequestPermission'))
const PermissionAwareRedirect = lazy(() => import('./PermissionAwareRedirect'))
const ThirdPartyRequestPermission = lazy(() => import('./ThirdPartyRequestPermission'))
const SignRequest = lazy(() => import('./SignRequest'))

function Dialogs() {
    return MaskUIRoot(
        <Web3Provider value={Web3Context}>
            <HashRouter>
                <Suspense fallback="">
                    <Switch>
                        <Route path={PopupRoutes.Wallet} children={frame(<Wallet />)} />
                        <Route path={PopupRoutes.Personas} children={frame(<Personas />)} exact />
                        <Route path={PopupRoutes.RequestPermission} exact>
                            <RequestPermissionPage />
                        </Route>
                        <Route path={PopupRoutes.PermissionAwareRedirect} exact>
                            <PermissionAwareRedirect />
                        </Route>
                        <Route path={PopupRoutes.ThirdPartyRequestPermission} exact>
                            <ThirdPartyRequestPermission />
                        </Route>
                        <Route path={PopupRoutes.SignRequest} exact>
                            <SignRequest />
                        </Route>
                        <Route children={<Redirect to={PopupRoutes.Wallet} />} />
                    </Switch>
                </Suspense>
            </HashRouter>
        </Web3Provider>,
    )
}
createNormalReactRoot(<Dialogs />)

function frame(x: React.ReactNode) {
    return <PopupFrame children={x} />
}

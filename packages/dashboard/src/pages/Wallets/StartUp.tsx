import { experimentalStyled as styled } from '@material-ui/core/styles'
import { Route, Routes, useNavigate } from 'react-router'
import { WalletCreationChooseUI } from '../../../../maskbook/src/plugins/Wallet/UI/CreateImportChooseDialog'
import { CreateWallet } from './CreateWallet'
import { ImportWallet } from './ImportWallet'

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`

const ChooseOptions = styled('div')`
    width: 520px;
`

enum CreateWalletRoutes {
    Choose = '/',
    Create = '/create',
    Import = '/import',
}
export function StartUp() {
    const navigate = useNavigate()
    return (
        <Container>
            <Routes>
                <Route path={CreateWalletRoutes.Choose}>
                    <ChooseOptions>
                        <WalletCreationChooseUI
                            onCreateClick={() => {
                                navigate(`/wallets${CreateWalletRoutes.Create}`)
                            }}
                            onImportClick={() => {
                                navigate(`/wallets${CreateWalletRoutes.Import}`)
                            }}
                        />
                    </ChooseOptions>
                </Route>
                <Route path={CreateWalletRoutes.Choose}>
                    <ChooseOptions>
                        <WalletCreationChooseUI onImportClick={() => {}} onCreateClick={() => {}} />
                    </ChooseOptions>
                </Route>
                <Route path={CreateWalletRoutes.Create}>
                    <CreateWallet />
                </Route>
                <Route path={CreateWalletRoutes.Import}>
                    <ImportWallet />
                </Route>
                <Route>
                    <div>nothing</div>
                </Route>
            </Routes>
        </Container>
    )
}

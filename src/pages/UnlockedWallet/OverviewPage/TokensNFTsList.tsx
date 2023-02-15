/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { fadeIn } from '@/animations'
import Amount from '@/components/Amount'
import AssetLogo from '@/components/AssetLogo'
import { TabItem } from '@/components/TabBar'
import Table, { TableRow } from '@/components/Table'
import TableCellAmount from '@/components/TableCellAmount'
import TableTabBar from '@/components/TableTabBar'
import { useAppSelector } from '@/hooks/redux'
import { selectAddressesAssets } from '@/storage/app-state/slices/addressesSlice'
import { AddressHash } from '@/types/addresses'

interface TokensNFTsListProps {
  className?: string
  limit?: number
  addressHashes?: AddressHash[]
  tokensTabTitle?: string
  nftsTabTitle?: string
  showTokens?: boolean
  showNfts?: boolean
}

const TokensNFTsList = ({ className, limit, addressHashes, tokensTabTitle, nftsTabTitle }: TokensNFTsListProps) => {
  const { t } = useTranslation()
  const [isLoadingAddresses, tokensStatus] = useAppSelector((s) => [s.addresses.loading, s.tokens.status])

  const tabs = [
    { value: 'tokens', label: tokensTabTitle ?? t('Tokens') },
    { value: 'nfts', label: nftsTabTitle ?? t('NFTs') }
  ]
  const [currentTab, setCurrentTab] = useState<TabItem>(tabs[0])

  const showSkeletonLoading = isLoadingAddresses || tokensStatus === 'uninitialized'

  return (
    <Table isLoading={showSkeletonLoading} className={className} minWidth="450px">
      <TableTabBar items={tabs} onTabChange={(tab) => setCurrentTab(tab)} activeTab={currentTab} />
      {
        {
          tokens: <TokensList limit={limit} addressHashes={addressHashes} />,
          nfts: <NFTsList limit={limit} addressHashes={addressHashes} />
        }[currentTab.value]
      }
    </Table>
  )
}

const TokensList = ({ className, limit, addressHashes }: TokensNFTsListProps) => {
  const { t } = useTranslation()
  const assets = useAppSelector((s) => selectAddressesAssets(s, addressHashes))

  const displayedAssets = limit ? assets.slice(0, limit) : assets

  return (
    <motion.div {...fadeIn} className={className}>
      {displayedAssets.map((asset) => (
        <TableRow key={asset.id} role="row" tabIndex={0}>
          <TokenRow>
            <AssetLogoStyled asset={asset} size={30} />
            <NameColumn>
              <TokenName>{asset.name}</TokenName>
              <TokenSymbol>{asset.symbol}</TokenSymbol>
            </NameColumn>
            <TableCellAmount>
              <TokenAmount fadeDecimals value={asset.balance} suffix={asset.symbol} />
              {asset.lockedBalance > 0 && (
                <TokenAvailableAmount>
                  {t('Available')}
                  <Amount fadeDecimals value={asset.balance - asset.lockedBalance} suffix={asset.symbol} />
                </TokenAvailableAmount>
              )}
            </TableCellAmount>
          </TokenRow>
        </TableRow>
      ))}
    </motion.div>
  )
}

const NFTsList = ({ className }: TokensNFTsListProps) => {
  const { t } = useTranslation()

  return (
    <motion.div {...fadeIn} className={className}>
      <TableRow role="row" tabIndex={0}>
        {t('Coming soon!')}
      </TableRow>
    </motion.div>
  )
}

export default styled(TokensNFTsList)`
  margin-bottom: 45px;
`

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

const AssetLogoStyled = styled(AssetLogo)`
  margin-right: 25px;
`

const TokenName = styled.div`
  font-size: 14px;
  font-weight: var(--fontWeight-semiBold);
  width: 200px;
`

const TokenSymbol = styled.div`
  color: ${({ theme }) => theme.font.tertiary};
  font-size: 11px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const TokenAmount = styled(Amount)`
  color: ${({ theme }) => theme.font.secondary};
`

const TokenAvailableAmount = styled.div`
  color: ${({ theme }) => theme.font.tertiary};
  font-size: 10px;
`

const NameColumn = styled(Column)`
  margin-right: 50px;
`

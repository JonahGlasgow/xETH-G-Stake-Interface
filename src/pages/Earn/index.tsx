import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { STAKING_REWARDS_INFO, useStakingInfo} from '../../state/stake/hooks'
import { STAKING_REWARDS_INFO_2, useStakingInfo2} from '../../state/stake/hooks2'
import { TYPE, ExternalLink } from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import PoolCard2 from '../../components/earn/PoolCard2'
import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { Countdown } from './Countdown'
import Loader from '../../components/Loader'
import { useActiveWeb3React } from '../../hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

export default function Earn() {
  const { chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()
  const stakingInfos2 = useStakingInfo2()

  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
  `

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)
  const stakingRewardsExist_2 = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO_2[chainId]?.length ?? 0) > 0)

  return (
    <PageWrapper gap="lg" justify="center" id="earn-page">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>xETH-G Staking Pool</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                Deposit xETH-G tokens to receive xETH-G!
                </TYPE.white>
              </RowBetween>{' '}
              <RowBetween>
                <TYPE.white fontSize={14}>
Staked tokens are eligible for rebases, which can compound. Your staked balance only reflects your original staked amount.
                </TYPE.white>
              </RowBetween>{' '}
              <RowBetween>
                <TYPE.white fontSize={14}>
The additional compounded rebase tokens are stored in the backend, and will be distributed when you withdraw after your lock period expires.

                </TYPE.white>
              </RowBetween>{' '}
              <RowBetween>
                <TYPE.white fontSize={14}>
Each time you deposit additional tokens from the same address, your lock period resets! Please stake from a different address to avoid this.
                </TYPE.white>
              </RowBetween>{' '}
              <RowBetween>
                <TYPE.white fontSize={14}>
If you withdraw early, you will lose your staking rewards and rebases!
                </TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://xeth.medium.com/introducing-xeth-g-xeth-with-governance-the-next-revolutionary-step-in-the-xeth-ecosystem-1ff8d6bebc76"
                target="_blank"
              >
                <TYPE.white fontSize={14}>Read more about xETH-G</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Active staking pools</TYPE.mediumHeader>
          <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} />
        </DataRow>
        <PoolSection>
        <TYPE.white fontSize={14}>30 Day Staking Pool</TYPE.white>

          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            'No active rewards'
          ) : (
            stakingInfos?.map(stakingInfo => {
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
            })
          )}

          <TYPE.white fontSize={14}>7 Day Staking Pool</TYPE.white>

           {stakingRewardsExist_2 && stakingInfos2?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            'No active rewards'
          ) : (
            stakingInfos2?.map(stakingInfo2 => {
              // need to sort by added liquidity here
              return <PoolCard2 key={stakingInfo2.stakingRewardAddress} stakingInfo={stakingInfo2} />
            })
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}

import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ETHER, JSBI, TokenAmount } from '@uniswap/sdk'
import { ButtonPrimary } from '../Button'
import { StakingInfo2 } from '../../state/stake/hooks2'
import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTotalSupply } from '../../data/TotalSupply'
import { useSinglePair } from '../../data/Reserves'
import useUSDCPrice from '../../utils/useUSDCPrice'

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: none;
`};
`

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '1')};
  background:linear-gradient(to bottom,rgba(0,0,0,1) 0%,rgba(273,140,12,1) 100%);
  color: ${({ theme, showBackground }) => (showBackground ? theme.white : theme.text1)} !important;

  ${({ showBackground }) =>
    showBackground &&
    `  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);`}
`

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 120px;
  grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 48px 1fr 96px;
  `};
`

// const APR = styled.div`
//   display: flex;
//   justify-content: flex-end;
// `

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`

export default function PoolCard2({ stakingInfo }: { stakingInfo: StakingInfo2 }) {
  const token0 = stakingInfo.tokens[0]
 // const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  //const currency1 = unwrappedToken(token0)

  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  // get the color of the token
  const token = currency0 === ETHER ? token0 : token0
  const WETH = currency0 === ETHER ? token0 : token0
  const backgroundColor = useColor(token)

  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo.stakedAmount.token)
  const [, stakingTokenPair] = useSinglePair(...stakingInfo.tokens)

  // let returnOverMonth: Percent = new Percent('0')
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined
  if (totalSupplyOfStakingToken && stakingTokenPair) {
    // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
  }

  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)

  return (
    <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
      <CardBGImage desaturate />
      <CardNoise />

      <TopSection>
        <DoubleCurrencyLogo  currency0={currency0} size={24} />
        <TYPE.white fontWeight={600} fontSize={24} style={{ marginLeft: '0px' }}>
          xETH-G
        </TYPE.white>

        <StyledInternalLink to={`/xETHG/SimpleStaking2/${currencyId(currency0)}`} style={{ width: '100%' }}>
          <ButtonPrimary padding="8px" borderRadius="8px">
            {isStaking ? 'Manage' : 'Deposit'}
          </ButtonPrimary>
        </StyledInternalLink>
      </TopSection>

      <StatContainer>
        <RowBetween>
          <TYPE.white>Minimum Stake Time</TYPE.white>
          <TYPE.white>
            {valueOfTotalStakedAmountInUSDC
              ? `$${valueOfTotalStakedAmountInUSDC.toFixed(0, { groupSeparator: ',' })}`
              : `${valueOfTotalStakedAmountInWETH?.toSignificant(4, { groupSeparator: ',' }) ?? ''} 7 Days`}
          </TYPE.white>
        </RowBetween>
        <RowBetween>
          <TYPE.white> Pool rate </TYPE.white>
          <TYPE.white>{`${stakingInfo.totalRewardRate
            ?.multiply(`${60 * 60 * 24 * 7}`)
            ?.toFixed(0, { groupSeparator: ',' })} xETH-G / week`}</TYPE.white>
        </RowBetween>
      </StatContainer>

      {isStaking && (
        <>
          <Break />
          <BottomSection showBackground={true}>
            <TYPE.black color={'white'} fontWeight={500}>
              <span>Your rate</span>
            </TYPE.black>

            <TYPE.black style={{ textAlign: 'right' }} color={'white'} fontWeight={500}>
              <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                ⚡
              </span>
              {`${stakingInfo.rewardRate
                ?.multiply(`${60 * 60 * 24 * 7}`)
                ?.toSignificant(4, { groupSeparator: ',' })} xETH-G / week`}
            </TYPE.black>
          </BottomSection>
        </>
      )}
    </Wrapper>
  )
}



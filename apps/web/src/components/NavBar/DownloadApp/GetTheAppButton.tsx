import { AppleLogo } from 'components/Icons/AppleLogo'
import { GooglePlayStoreLogo } from 'components/Icons/GooglePlayStoreLogo'
import Row from 'components/Row'
import { Trans } from 'i18n'
import styled, { useTheme } from 'lib/styled-components'
import { Wiggle } from 'pages/Landing/components/animations'
import { useOpenModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { Text } from 'ui/src'

const StyledButton = styled.button`
  height: 40px;
  background: ${({ theme }) => theme.surface1};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.surface3};
  padding: 8px 16px 8px 12px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.surface2};
  }
`

export const WiggleIcon = styled(Wiggle)`
  flex: 0;
  height: auto;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`
export function GetTheAppButton({ showIcons = true }: { showIcons?: boolean }) {
  const theme = useTheme()
  const openModal = useOpenModal(ApplicationModal.GET_THE_APP)

  return (
    <StyledButton onClick={openModal}>
      <Row width="fit-content" gap="12px" align="center" justify="center">
        <Text
          data-testid="get-the-app-cta"
          variant="body2"
          lineHeight={0}
          whiteSpace="nowrap"
          $lg={{
            display: showIcons ? 'none' : 'block',
          }}
        >
          <Trans i18nKey="common.getTheApp" />
        </Text>
        {showIcons && (
          <WiggleIcon>
            <AppleLogo fill={theme.neutral1} />
          </WiggleIcon>
        )}
        {showIcons && (
          <WiggleIcon>
            <GooglePlayStoreLogo />
          </WiggleIcon>
        )}
      </Row>
    </StyledButton>
  )
}

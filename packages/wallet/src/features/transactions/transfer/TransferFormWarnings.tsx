import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { UniverseChainId, WalletChainId } from 'uniswap/src/types/chains'
import { isSameAddress } from 'utilities/src/addresses'
import { WarningModal } from 'wallet/src/components/modals/WarningModal/WarningModal'
import { useIsErc20Contract } from 'wallet/src/features/contracts/hooks'
import { WarningSeverity } from 'wallet/src/features/transactions/WarningModal/types'
import { useAllTransactionsBetweenAddresses } from 'wallet/src/features/transactions/hooks/useAllTransactionsBetweenAddresses'
import { useIsSmartContractAddress } from 'wallet/src/features/transactions/transfer/hooks/useIsSmartContractAddress'
import { TransferSpeedbump } from 'wallet/src/features/transactions/transfer/types'
import { useActiveAccountAddressWithThrow, useDisplayName, useSignerAccounts } from 'wallet/src/features/wallet/hooks'
import { DisplayNameType } from 'wallet/src/features/wallet/types'

interface TransferFormWarningProps {
  recipient?: string
  chainId?: WalletChainId
  showSpeedbumpModal: boolean
  onNext: () => void
  setTransferSpeedbump: (w: TransferSpeedbump) => void
  setShowSpeedbumpModal: (b: boolean) => void
}

export function TransferFormSpeedbumps({
  recipient,
  chainId,
  showSpeedbumpModal,
  onNext,
  setTransferSpeedbump,
  setShowSpeedbumpModal,
}: TransferFormWarningProps): JSX.Element | null {
  const { t } = useTranslation()

  const activeAddress = useActiveAccountAddressWithThrow()
  const previousTransactions = useAllTransactionsBetweenAddresses(activeAddress, recipient)
  const isNewRecipient = !previousTransactions || previousTransactions.length === 0
  const currentSignerAccounts = useSignerAccounts()
  const isSignerRecipient = useMemo(
    () => currentSignerAccounts.some((a) => a.address === recipient),
    [currentSignerAccounts, recipient],
  )

  const { isSmartContractAddress, loading: addressLoading } = useIsSmartContractAddress(
    recipient,
    chainId ?? UniverseChainId.Mainnet,
  )

  const shouldWarnSelfSend = isSameAddress(activeAddress, recipient)
  const shouldWarnSmartContract = isNewRecipient && !isSignerRecipient && isSmartContractAddress
  const shouldWarnNewAddress = isNewRecipient && !isSignerRecipient && !shouldWarnSmartContract
  const shouldWarnErc20 = useIsErc20Contract(recipient, chainId ?? UniverseChainId.Mainnet)

  useEffect(() => {
    setTransferSpeedbump({
      hasWarning: shouldWarnSmartContract || shouldWarnNewAddress || shouldWarnErc20 || shouldWarnSelfSend,
      loading: addressLoading,
    })
  }, [
    setTransferSpeedbump,
    addressLoading,
    shouldWarnSmartContract,
    shouldWarnNewAddress,
    shouldWarnErc20,
    shouldWarnSelfSend,
  ])

  const onCloseWarning = (): void => {
    setShowSpeedbumpModal(false)
  }

  const displayName = useDisplayName(recipient)

  if (!showSpeedbumpModal) {
    return null
  }
  if (shouldWarnSelfSend) {
    return (
      <WarningModal
        caption={t('send.warning.self.message')}
        closeText={t('common.button.cancel')}
        confirmText={t('common.button.understand')}
        modalName={ModalName.SendWarning}
        severity={WarningSeverity.High}
        title={t('send.warning.self.title')}
        onClose={onCloseWarning}
        onConfirm={onNext}
      />
    )
  }
  if (shouldWarnErc20) {
    return (
      <WarningModal
        caption={t('send.warning.erc20.message')}
        closeText={t('common.button.cancel')}
        confirmText={t('common.button.understand')}
        modalName={ModalName.SendWarning}
        severity={WarningSeverity.High}
        title={t('send.warning.erc20.title')}
        onClose={onCloseWarning}
        onConfirm={onNext}
      />
    )
  }
  if (shouldWarnSmartContract) {
    return (
      <WarningModal
        caption={t('send.warning.smartContract.message')}
        closeText={t('common.button.cancel')}
        confirmText={t('common.button.understand')}
        modalName={ModalName.SendWarning}
        severity={WarningSeverity.None}
        title={t('send.warning.smartContract.title')}
        onClose={onCloseWarning}
        onConfirm={onNext}
      />
    )
  }
  if (shouldWarnNewAddress) {
    return (
      <WarningModal
        caption={t('send.warning.newAddress.message')}
        closeText={t('common.button.cancel')}
        confirmText={t('common.button.confirm')}
        modalName={ModalName.SendWarning}
        severity={WarningSeverity.Medium}
        title={t('send.warning.newAddress.title')}
        onClose={onCloseWarning}
        onConfirm={onNext}
      >
        <TransferRecipient address={recipient} displayName={displayName?.name} type={displayName?.type} />
      </WarningModal>
    )
  }
  return null
}

interface TransferRecipientProps {
  displayName?: string
  address?: string
  type?: DisplayNameType
}

const TransferRecipient = ({
  displayName,
  address,
  type = DisplayNameType.Address,
}: TransferRecipientProps): JSX.Element => {
  return (
    <Flex
      borderColor="$surface3"
      borderRadius="$rounded12"
      borderWidth={1}
      gap="$spacing8"
      px="$spacing16"
      py="$spacing12"
      width="100%"
    >
      <Text color="$neutral1" textAlign="center" variant="subheading2">
        {type === DisplayNameType.ENS ? displayName : address}
      </Text>
      {type === DisplayNameType.ENS && (
        <Text color="$neutral2" textAlign="center" variant="buttonLabel4">
          {address}
        </Text>
      )}
    </Flex>
  )
}

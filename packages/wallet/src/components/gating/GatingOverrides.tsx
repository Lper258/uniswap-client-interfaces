import React from 'react'
import { Accordion, Button, Flex, Separator, Text, isWeb } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons'
import { Experiments } from 'uniswap/src/features/gating/experiments'
import { FeatureFlags, WALLET_FEATURE_FLAG_NAMES, getFeatureFlagName } from 'uniswap/src/features/gating/flags'
import { useFeatureFlagWithExposureLoggingDisabled } from 'uniswap/src/features/gating/hooks'
import { Statsig } from 'uniswap/src/features/gating/sdk/statsig'
import { Switch, WebSwitch } from 'wallet/src/components/buttons/Switch'

export function GatingOverrides(): JSX.Element {
  const featureFlagRows: JSX.Element[] = []
  for (const [flag, flagName] of WALLET_FEATURE_FLAG_NAMES.entries()) {
    featureFlagRows.push(<FeatureFlagRow key={flagName} flag={flag} />)
  }

  const experimentRows: JSX.Element[] = []
  for (const experiment of Object.values(Experiments)) {
    experimentRows.push(<ExperimentRow key={experiment} experiment={experiment} />)
  }

  return (
    <>
      <Text variant="heading3">Gating</Text>

      <Accordion.Item value="feature-flags">
        <AccordionHeader title="⛳️ Feature Flags" />

        <Accordion.Content>
          <Button p="$spacing4" theme="tertiary" onPress={() => Statsig.removeGateOverride()}>
            <Text variant="body2">Clear all local feature gate overrides</Text>
          </Button>

          <Flex gap="$spacing12" mt="$spacing12">
            {featureFlagRows}
          </Flex>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="experiments">
        <AccordionHeader title="🔬 Experiments" />

        <Accordion.Content>
          <Button p="$spacing4" theme="tertiary" onPress={() => Statsig.removeConfigOverride()}>
            <Text variant="body2">Clear all local experiment/config overrides</Text>
          </Button>

          <Flex gap="$spacing24" mt="$spacing12">
            {experimentRows}
          </Flex>
        </Accordion.Content>
      </Accordion.Item>

      <Button
        p="$spacing4"
        theme="tertiary"
        onPress={() => {
          Statsig.removeGateOverride()
          Statsig.removeConfigOverride()
          Statsig.removeLayerOverride()
        }}
      >
        <Text variant="body2">Clear all gating overrides</Text>
      </Button>
    </>
  )
}

export function AccordionHeader({ title }: { title: React.ReactNode }): JSX.Element {
  return (
    <Accordion.Header mt="$spacing12">
      <Accordion.Trigger width="100%">
        {({ open }: { open: boolean }): JSX.Element => (
          <>
            <Flex row justifyContent="space-between">
              <Text variant="subheading1">{title}</Text>
              <RotatableChevron direction={open ? 'up' : 'down'} />
            </Flex>
          </>
        )}
      </Accordion.Trigger>
    </Accordion.Header>
  )
}

function FeatureFlagRow({ flag }: { flag: FeatureFlags }): JSX.Element {
  const status = useFeatureFlagWithExposureLoggingDisabled(flag)
  const name = getFeatureFlagName(flag)

  const SwitchElement = isWeb ? WebSwitch : Switch

  return (
    <Flex row alignItems="center" gap="$spacing16" justifyContent="space-between">
      <Text variant="body1">{name}</Text>
      <SwitchElement
        value={status}
        onValueChange={(newValue: boolean): void => {
          Statsig.overrideGate(name, newValue)
        }}
      />
    </Flex>
  )
}

function ExperimentRow({ experiment }: { experiment: Experiments }): JSX.Element {
  return (
    <>
      <Separator />
      <Flex>
        <Text variant="body1">{experiment}</Text>
        <Flex gap="$spacing4">
          <Flex
            key={experiment}
            row
            alignItems="center"
            gap="$spacing16"
            justifyContent="space-between"
            paddingStart="$spacing16"
          >
            <Text variant="body2" />
            {/* TODO(WEB-4164): implement experiment groups overrides */}
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

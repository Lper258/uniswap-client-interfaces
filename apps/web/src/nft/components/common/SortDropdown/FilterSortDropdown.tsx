import styled from 'lib/styled-components'
import { FilterDropdown, FilterItem } from 'nft/components/collection/MarketplaceSelect'
import { useCollectionFilters } from 'nft/hooks'
import { DropDownOption } from 'nft/types'
import { useState } from 'react'
import { Check } from 'react-feather'

const CheckIcon = styled(Check)`
  height: 20px;
  width: 20px;
  color: ${({ theme }) => theme.accent1};
`

export const FilterSortDropdown = ({ sortDropDownOptions }: { sortDropDownOptions: DropDownOption[] }) => {
  const [isOpen, setOpen] = useState(false)
  const onClick: React.MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault()
    setOpen(!isOpen)
  }
  const sortItems = sortDropDownOptions.map((option) => (
    <SortByItem dropDownOption={option} parentOnClick={onClick} key={option.displayText} />
  ))
  return <FilterDropdown title="Sort by" items={sortItems} onClick={onClick} isOpen={isOpen} />
}

const SortByItem = ({
  dropDownOption,
  parentOnClick,
}: {
  dropDownOption: DropDownOption
  parentOnClick: React.MouseEventHandler<HTMLElement>
}) => {
  const sortBy = useCollectionFilters((state) => state.sortBy)
  const checkMark = dropDownOption.sortBy !== undefined && sortBy === dropDownOption.sortBy ? <CheckIcon /> : <></>
  const onClick: React.MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault()
    parentOnClick(e)
    dropDownOption.onClick()
  }
  return <FilterItem title={dropDownOption.displayText} element={checkMark} onClick={onClick} />
}

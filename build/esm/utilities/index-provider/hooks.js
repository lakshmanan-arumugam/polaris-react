import { useContext, useRef, useCallback } from 'react';
import { SELECT_ALL_ITEMS, SelectionType } from './types.js';
import { IndexSelectionChangeContext, IndexRowContext, IndexContext } from './context.js';
import { useI18n } from '../i18n/hooks.js';

function useIndexSelectionChange() {
  const onSelectionChange = useContext(IndexSelectionChangeContext);

  if (!onSelectionChange) {
    throw new Error(`Missing IndexProvider context`);
  }

  return onSelectionChange;
}
function useIndexRow() {
  const indexRow = useContext(IndexRowContext);

  if (!indexRow) {
    throw new Error(`Missing IndexProvider context`);
  }

  return indexRow;
}
function useIndexValue() {
  const index = useContext(IndexContext);

  if (!index) {
    throw new Error(`Missing IndexProvider context`);
  }

  return index;
}
function useBulkSelectionData({
  selectedItemsCount,
  itemCount,
  hasMoreItems,
  resourceName: passedResourceName
}) {
  const i18n = useI18n();
  const selectable = Boolean(selectedItemsCount);
  const selectMode = selectedItemsCount === 'All' || selectedItemsCount > 0;
  const defaultResourceName = {
    singular: i18n.translate('Polaris.IndexProvider.defaultItemSingular'),
    plural: i18n.translate('Polaris.IndexProvider.defaultItemPlural')
  };
  const resourceName = passedResourceName ? passedResourceName : defaultResourceName;
  const paginatedSelectAllText = getPaginatedSelectAllText();
  const bulkActionsLabel = getBulkActionsLabel();
  const bulkActionsAccessibilityLabel = getBulkActionsAccessibilityLabel();
  let bulkSelectState = 'indeterminate';

  if (!selectedItemsCount || selectedItemsCount === 0) {
    bulkSelectState = undefined;
  } else if (selectedItemsCount === SELECT_ALL_ITEMS || selectedItemsCount === itemCount) {
    bulkSelectState = true;
  }

  return {
    paginatedSelectAllText,
    bulkActionsLabel,
    bulkActionsAccessibilityLabel,
    resourceName,
    selectMode,
    bulkSelectState,
    selectable
  };

  function getPaginatedSelectAllText() {
    if (!selectable || !hasMoreItems) {
      return;
    }

    if (selectedItemsCount === SELECT_ALL_ITEMS) {
      return i18n.translate('Polaris.IndexProvider.allItemsSelected', {
        itemsLength: itemCount,
        resourceNamePlural: resourceName.plural.toLocaleLowerCase()
      });
    }
  }

  function getBulkActionsLabel() {
    const selectedItemsCountLabel = selectedItemsCount === SELECT_ALL_ITEMS ? `${itemCount}+` : selectedItemsCount;
    return i18n.translate('Polaris.IndexProvider.selected', {
      selectedItemsCount: selectedItemsCountLabel
    });
  }

  function getBulkActionsAccessibilityLabel() {
    const totalItemsCount = itemCount;
    const allSelected = selectedItemsCount === totalItemsCount;

    if (totalItemsCount === 1 && allSelected) {
      return i18n.translate('Polaris.IndexProvider.a11yCheckboxDeselectAllSingle', {
        resourceNameSingular: resourceName.singular
      });
    } else if (totalItemsCount === 1) {
      return i18n.translate('Polaris.IndexProvider.a11yCheckboxSelectAllSingle', {
        resourceNameSingular: resourceName.singular
      });
    } else if (allSelected) {
      return i18n.translate('Polaris.IndexProvider.a11yCheckboxDeselectAllMultiple', {
        itemsLength: itemCount,
        resourceNamePlural: resourceName.plural
      });
    } else {
      return i18n.translate('Polaris.IndexProvider.a11yCheckboxSelectAllMultiple', {
        itemsLength: itemCount,
        resourceNamePlural: resourceName.plural
      });
    }
  }
}
function useHandleBulkSelection({
  onSelectionChange = () => {}
}) {
  const lastSelected = useRef(null);
  const handleSelectionChange = useCallback((selectionType, toggleType, selection, sortOrder) => {
    const prevSelected = lastSelected.current;

    if (SelectionType.Multi && typeof sortOrder === 'number') {
      lastSelected.current = sortOrder;
    }

    if (selectionType === SelectionType.Single || selectionType === SelectionType.Multi && (typeof prevSelected !== 'number' || typeof sortOrder !== 'number')) {
      onSelectionChange(SelectionType.Single, toggleType, selection);
    } else if (selectionType === SelectionType.Multi) {
      const min = Math.min(prevSelected, sortOrder);
      const max = Math.max(prevSelected, sortOrder);
      onSelectionChange(selectionType, toggleType, [min, max]);
    } else if (selectionType === SelectionType.Page || selectionType === SelectionType.All) {
      onSelectionChange(selectionType, toggleType);
    }
  }, [onSelectionChange]);
  return handleSelectionChange;
}

export { useBulkSelectionData, useHandleBulkSelection, useIndexRow, useIndexSelectionChange, useIndexValue };

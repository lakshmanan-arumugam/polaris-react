'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getVisibleAndHiddenTabIndices(tabs, selected, disclosureWidth, tabWidths, containerWidth) {
  const sumTabWidths = tabWidths.reduce((sum, width) => sum + width, 0);
  const arrayOfTabIndices = tabs.map((_, index) => {
    return index;
  });
  const visibleTabs = [];
  const hiddenTabs = [];

  if (containerWidth > sumTabWidths) {
    visibleTabs.push(...arrayOfTabIndices);
  } else {
    visibleTabs.push(selected);
    let tabListWidth = tabWidths[selected];
    arrayOfTabIndices.forEach(currentTabIndex => {
      if (currentTabIndex !== selected) {
        const currentTabWidth = tabWidths[currentTabIndex];

        if (tabListWidth + currentTabWidth >= containerWidth - disclosureWidth) {
          hiddenTabs.push(currentTabIndex);
          return;
        }

        visibleTabs.push(currentTabIndex);
        tabListWidth += currentTabWidth;
      }
    });
  }

  return {
    visibleTabs,
    hiddenTabs
  };
}

exports.getVisibleAndHiddenTabIndices = getVisibleAndHiddenTabIndices;

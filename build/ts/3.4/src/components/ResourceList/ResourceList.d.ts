import React, { ReactElement } from 'react';
import { ResourceListSelectedItems } from '../../utilities/resource-list';
import { SelectOption } from '../Select';
import { ResourceItem } from '../ResourceItem';
import { BulkActionsProps } from '../BulkActions';
export interface ResourceListProps<TItemType = any> {
    /** Item data; each item is passed to renderItem */
    items: TItemType[];
    filterControl?: React.ReactNode;
    /** The markup to display when no resources exist yet. Renders when set and items is empty. */
    emptyState?: React.ReactNode;
    /** The markup to display when no results are returned on search or filter of the list. Renders when `filterControl` is set, items are empty, and `emptyState` is not set.
     * @default EmptySearchResult
     */
    emptySearchState?: React.ReactNode;
    /** Name of the resource, such as customers or products */
    resourceName?: {
        singular: string;
        plural: string;
    };
    /** Up to 2 bulk actions that will be given more prominence */
    promotedBulkActions?: BulkActionsProps['promotedActions'];
    /** Actions available on the currently selected items */
    bulkActions?: BulkActionsProps['actions'];
    /** Collection of IDs for the currently selected items */
    selectedItems?: ResourceListSelectedItems;
    /** Whether or not the list has filter(s) applied */
    isFiltered?: boolean;
    /** Renders a Select All button at the top of the list and checkboxes in front of each list item. For use when bulkActions aren't provided. **/
    selectable?: boolean;
    /** Whether or not there are more items than currently set on the items prop. Determines whether or not to set the paginatedSelectAllAction and paginatedSelectAllText props on the BulkActions component. */
    hasMoreItems?: boolean;
    /** Overlays item list with a spinner while a background action is being performed */
    loading?: boolean;
    /** Boolean to show or hide the header */
    showHeader?: boolean;
    /** Total number of resources */
    totalItemsCount?: number;
    /** Current value of the sort control */
    sortValue?: string;
    /** Collection of sort options to choose from */
    sortOptions?: SelectOption[];
    /** ReactNode to display instead of the sort control */
    alternateTool?: React.ReactNode;
    /** Callback when sort option is changed */
    onSortChange?(selected: string, id: string): void;
    /** Callback when selection is changed */
    onSelectionChange?(selectedItems: ResourceListSelectedItems): void;
    /** Function to render each list item, must return a ResourceItem component */
    renderItem(item: TItemType, id: string, index: number): React.ReactNode;
    /** Function to customize the unique ID for each item */
    idForItem?(item: TItemType, index: number): string;
    /** Function to resolve the ids of items */
    resolveItemId?(item: TItemType): string;
}
declare type ResourceListType = (<TItemType>(value: ResourceListProps<TItemType>) => ReactElement) & {
    Item: typeof ResourceItem;
};
export declare const ResourceList: ResourceListType;
export {};

import React from 'react';
import { BulkActionsProps } from '../BulkActions';
import { IndexProviderProps } from '../../utilities/index-provider';
import type { NonEmptyArray } from '../../types';
export interface IndexTableHeading {
    title: string;
    new?: boolean;
    hidden?: boolean;
}
export interface IndexTableBaseProps {
    headings: NonEmptyArray<IndexTableHeading>;
    promotedBulkActions?: BulkActionsProps['promotedActions'];
    bulkActions?: BulkActionsProps['actions'];
    children?: React.ReactNode;
    emptyState?: React.ReactNode;
    sort?: React.ReactNode;
    lastColumnSticky?: boolean;
    selectable?: boolean;
}
export interface TableHeadingRect {
    offsetWidth: number;
    offsetLeft: number;
}
export interface IndexTableProps extends IndexTableBaseProps, IndexProviderProps {
}
export declare function IndexTable({ children, selectable, itemCount, selectedItemsCount, resourceName: passedResourceName, loading, hasMoreItems, condensed, onSelectionChange, ...indexTableBaseProps }: IndexTableProps): JSX.Element;
export declare namespace IndexTable {
    var Cell: React.NamedExoticComponent<import("./components").CellProps>;
    var Row: React.NamedExoticComponent<import("./components").RowProps>;
}

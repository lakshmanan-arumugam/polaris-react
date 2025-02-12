/// <reference types="react" />
import type { BadgeAction, DisableableAction, Action, ActionListSection, MenuGroupDescriptor } from '../../types';
export declare type BulkAction = DisableableAction & BadgeAction;
declare type BulkActionListSection = ActionListSection;
export interface BulkActionsProps {
    /** Visually hidden text for screen readers */
    accessibilityLabel?: string;
    /** Whether to render the small screen BulkActions or not */
    smallScreen?: boolean;
    /** Label for the bulk actions */
    label?: string;
    /** State of the bulk actions checkbox */
    selected?: boolean | 'indeterminate';
    /** List is in a selectable state */
    selectMode?: boolean;
    /** Actions that will be given more prominence */
    promotedActions?: (BulkAction | MenuGroupDescriptor)[];
    /** List of actions */
    actions?: (BulkAction | BulkActionListSection)[];
    /** Text to select all across pages */
    paginatedSelectAllText?: string;
    /** Action for selecting all across pages */
    paginatedSelectAllAction?: Action;
    /** Disables bulk actions */
    disabled?: boolean;
    /** Callback when the select all checkbox is clicked */
    onToggleAll?(): void;
    /** Callback when selectable state of list is changed */
    onSelectModeToggle?(selectMode: boolean): void;
    /** Callback when more actions button is toggled */
    onMoreActionPopoverToggle?(isOpen: boolean): void;
}
export declare function BulkActions(props: BulkActionsProps): JSX.Element;
export {};

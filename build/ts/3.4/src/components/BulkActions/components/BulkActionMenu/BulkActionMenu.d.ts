/// <reference types="react" />
import { MenuGroupDescriptor } from '../../../../types';
export interface BulkActionsMenuProps extends MenuGroupDescriptor {
    isNewBadgeInBadgeActions: boolean;
}
export declare function BulkActionMenu({ title, actions, isNewBadgeInBadgeActions, }: BulkActionsMenuProps): JSX.Element;

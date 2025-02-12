import React from 'react';
import type { Action } from '../../types';
export interface AccountConnectionProps {
    /** Content to display as title */
    title?: React.ReactNode;
    /** Content to display as additional details */
    details?: React.ReactNode;
    /** Content to display as terms of service */
    termsOfService?: React.ReactNode;
    /** The name of the service */
    accountName?: string;
    /** URL for the user’s avatar image */
    avatarUrl?: string;
    /** Set if the account is connected */
    connected?: boolean;
    /** Action for account connection */
    action?: Action;
}
export declare function AccountConnection({ connected, action, avatarUrl, accountName, title, details, termsOfService, }: AccountConnectionProps): JSX.Element;

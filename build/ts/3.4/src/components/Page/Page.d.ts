import React from 'react';
import { HeaderProps } from './components';
export interface PageProps extends HeaderProps {
    /** The contents of the page */
    children?: React.ReactNode;
    /** Remove the normal max-width on the page */
    fullWidth?: boolean;
    /** Decreases the maximum layout width. Intended for single-column layouts */
    narrowWidth?: boolean;
    /** Displays a divider between the page header and the page content */
    divider?: boolean;
}
export declare function Page({ children, fullWidth, narrowWidth, divider, ...rest }: PageProps): JSX.Element;

import React from 'react';
import { BaseButton, ConnectedDisclosure, IconSource } from '../../types';
export interface ButtonProps extends BaseButton {
    /** The content to display inside the button */
    children?: string | string[];
    /** Provides extra visual weight and identifies the primary action in a set of buttons */
    primary?: boolean;
    /** Indicates a dangerous or potentially negative action */
    destructive?: boolean;
    /**
     * Changes the size of the button, giving it more or less padding
     * @default 'medium'
     */
    size?: 'slim' | 'medium' | 'large';
    /** Changes the inner text alignment of the button */
    textAlign?: 'left' | 'right' | 'center';
    /** Gives the button a subtle alternative to the default button styling, appropriate for certain backdrops */
    outline?: boolean;
    /** Allows the button to grow to the width of its container */
    fullWidth?: boolean;
    /** Displays the button with a disclosure icon. Defaults to `down` when set to true */
    disclosure?: 'down' | 'up' | 'select' | boolean;
    /** Renders a button that looks like a link */
    plain?: boolean;
    /** Makes `plain` and `outline` Button colors (text, borders, icons) the same as the current text color. Also adds an underline to `plain` Buttons */
    monochrome?: boolean;
    /** Removes underline from button text (including on interaction) when `monochrome` and `plain` are true */
    removeUnderline?: boolean;
    /** Icon to display to the left of the button content */
    icon?: React.ReactElement | IconSource;
    /** Disclosure button connected right of the button. Toggles a popover action list. */
    connectedDisclosure?: ConnectedDisclosure;
}
export declare function Button({ id, children, url, disabled, external, download, submit, loading, pressed, accessibilityLabel, role, ariaControls, ariaExpanded, ariaDescribedBy, onClick, onFocus, onBlur, onKeyDown, onKeyPress, onKeyUp, onMouseEnter, onTouchStart, icon, primary, outline, destructive, disclosure, plain, monochrome, removeUnderline, size, textAlign, fullWidth, connectedDisclosure, }: ButtonProps): JSX.Element;

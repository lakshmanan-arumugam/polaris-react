import React from 'react';
export interface SheetProps {
    /** Whether or not the sheet is open */
    open: boolean;
    /** The child elements to render in the sheet */
    children: React.ReactNode;
    /** Callback when the backdrop is clicked or `ESC` is pressed */
    onClose(): void;
    /** Callback when the sheet has completed entering */
    onEntered?(): void;
    /** Callback when the sheet has started to exit */
    onExit?(): void;
    /** ARIA label for sheet */
    accessibilityLabel: string;
    /** The element or the RefObject that activates the Sheet */
    activator?: React.RefObject<HTMLElement> | React.ReactElement;
}
/** @deprecated Use <Modal /> instead or avoid modal patterns all together. */
export declare function Sheet({ children, open, onClose, onEntered, onExit, accessibilityLabel, activator, }: SheetProps): JSX.Element;

import React from 'react';
import { AriaAttributes } from 'react';
import { PopoverCloseSource, PopoverAutofocusTarget, Pane, PopoverOverlayProps, Section } from './components';
export { PopoverCloseSource };
export { PopoverAutofocusTarget };
export interface PopoverProps {
    /** The content to display inside the popover */
    children?: React.ReactNode;
    /** The preferred direction to open the popover */
    preferredPosition?: PopoverOverlayProps['preferredPosition'];
    /** The preferred alignment of the popover relative to its activator */
    preferredAlignment?: PopoverOverlayProps['preferredAlignment'];
    /** Show or hide the Popover */
    active: boolean;
    /** The element to activate the Popover */
    activator: React.ReactElement;
    /**
     * Use the activator's input element to calculate the Popover position
     * @default true
     */
    preferInputActivator?: PopoverOverlayProps['preferInputActivator'];
    /**
     * The element type to wrap the activator with
     * @default 'div'
     */
    activatorWrapper?: string;
    /** Override on the default z-index of 400 */
    zIndexOverride?: number;
    /** Prevents focusing the activator or the next focusable element when the popover is deactivated */
    preventFocusOnClose?: boolean;
    /** Automatically add wrap content in a section */
    sectioned?: boolean;
    /** Allow popover to stretch to the full width of its activator */
    fullWidth?: boolean;
    /** Allow popover to stretch to fit content vertically */
    fullHeight?: boolean;
    /** Allow popover content to determine the overlay width and height */
    fluidContent?: boolean;
    /** Remains in a fixed position */
    fixed?: boolean;
    /** Used to illustrate the type of popover element */
    ariaHaspopup?: AriaAttributes['aria-haspopup'];
    /** Allow the popover overlay to be hidden when printing */
    hideOnPrint?: boolean;
    /** Callback when popover is closed */
    onClose(source: PopoverCloseSource): void;
    /** Accepts a color scheme for the contents of the popover */
    colorScheme?: PopoverOverlayProps['colorScheme'];
    /**
     * The preferred auto focus target defaulting to the popover container
     * @default 'container'
     */
    autofocusTarget?: PopoverAutofocusTarget;
}
export interface PopoverPublicAPI {
    forceUpdatePosition(): void;
}
export declare const Popover: React.ForwardRefExoticComponent<PopoverProps & React.RefAttributes<PopoverPublicAPI>> & {
    Pane: typeof Pane;
    Section: typeof Section;
};

import React from 'react';
import { FooterProps, Section } from './components';
export interface ModalProps extends FooterProps {
    /** Whether the modal is open or not */
    open: boolean;
    /** The url that will be loaded as the content of the modal */
    src?: string;
    /** The name of the modal content iframe */
    iFrameName?: string;
    /** The content for the title of the modal */
    title: string | React.ReactNode;
    /**
     * Hide the title in the modal
     * @default false
     */
    titleHidden?: boolean;
    /** The content to display inside modal */
    children?: React.ReactNode;
    /** Inner content of the footer */
    footer?: React.ReactNode;
    /** Disable animations and open modal instantly */
    instant?: boolean;
    /** Automatically adds sections to modal */
    sectioned?: boolean;
    /** Increases the modal width */
    large?: boolean;
    /** Decreases the modal width */
    small?: boolean;
    /** Limits modal height on large sceens with scrolling */
    limitHeight?: boolean;
    /** Replaces modal content with a spinner while a background action is being performed */
    loading?: boolean;
    /** Callback when the modal is closed */
    onClose(): void;
    /** Callback when iframe has loaded */
    onIFrameLoad?(evt: React.SyntheticEvent<HTMLIFrameElement>): void;
    /** Callback when modal transition animation has ended */
    onTransitionEnd?(): void;
    /** Callback when the bottom of the modal content is reached */
    onScrolledToBottom?(): void;
    /** The element or the RefObject that activates the Modal */
    activator?: React.RefObject<HTMLElement> | React.ReactElement;
    /** Removes Scrollable container from the modal content */
    noScroll?: boolean;
}
export declare const Modal: React.FunctionComponent<ModalProps> & {
    Section: typeof Section;
};

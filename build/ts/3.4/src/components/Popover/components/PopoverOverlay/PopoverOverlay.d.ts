import React, { PureComponent } from 'react';
import { ThemeProviderProps } from '../../../ThemeProvider';
import { PositionedOverlayProps } from '../../../PositionedOverlay';
export declare enum PopoverCloseSource {
    Click = 0,
    EscapeKeypress = 1,
    FocusOut = 2,
    ScrollOut = 3
}
export declare type PopoverAutofocusTarget = 'none' | 'first-node' | 'container';
declare enum TransitionStatus {
    Entering = "entering",
    Entered = "entered",
    Exiting = "exiting",
    Exited = "exited"
}
export interface PopoverOverlayProps {
    children?: React.ReactNode;
    fullWidth?: boolean;
    fullHeight?: boolean;
    fluidContent?: boolean;
    preferredPosition?: PositionedOverlayProps['preferredPosition'];
    preferredAlignment?: PositionedOverlayProps['preferredAlignment'];
    active: boolean;
    id: string;
    zIndexOverride?: number;
    activator: HTMLElement;
    preferInputActivator?: PositionedOverlayProps['preferInputActivator'];
    sectioned?: boolean;
    fixed?: boolean;
    hideOnPrint?: boolean;
    onClose(source: PopoverCloseSource): void;
    colorScheme?: NonNullable<ThemeProviderProps['theme']>['colorScheme'];
    autofocusTarget?: PopoverAutofocusTarget;
}
interface State {
    transitionStatus: TransitionStatus;
}
export declare class PopoverOverlay extends PureComponent<PopoverOverlayProps, State> {
    state: State;
    private contentNode;
    private enteringTimer?;
    private exitingTimer?;
    private overlayRef;
    constructor(props: PopoverOverlayProps);
    forceUpdatePosition(): void;
    changeTransitionStatus(transitionStatus: TransitionStatus, cb?: () => void): void;
    componentDidMount(): void;
    componentDidUpdate(oldProps: PopoverOverlayProps): void;
    componentWillUnmount(): void;
    render(): JSX.Element | null;
    private clearTransitionTimeout;
    private focusContent;
    private renderPopover;
    private handleClick;
    private handleScrollOut;
    private handleEscape;
    private handleFocusFirstItem;
    private handleFocusLastItem;
}
export declare function nodeContainsDescendant(rootNode: HTMLElement, descendant: HTMLElement): boolean;
export {};

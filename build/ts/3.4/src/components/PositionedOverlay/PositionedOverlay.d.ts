import React, { PureComponent } from 'react';
import { Rect } from '../../utilities/geometry';
import { PreferredPosition, PreferredAlignment } from './utilities/math';
declare type Positioning = 'above' | 'below';
interface OverlayDetails {
    left?: number;
    right?: number;
    desiredHeight: number;
    positioning: Positioning;
    measuring: boolean;
    activatorRect: Rect;
}
export interface PositionedOverlayProps {
    active: boolean;
    activator: HTMLElement;
    preferInputActivator?: boolean;
    preferredPosition?: PreferredPosition;
    preferredAlignment?: PreferredAlignment;
    fullWidth?: boolean;
    fixed?: boolean;
    preventInteraction?: boolean;
    classNames?: string;
    zIndexOverride?: number;
    render(overlayDetails: OverlayDetails): React.ReactNode;
    onScrollOut?(): void;
}
interface State {
    measuring: boolean;
    activatorRect: Rect;
    left?: number;
    right?: number;
    top: number;
    height: number;
    width: number | null;
    positioning: Positioning;
    zIndex: number | null;
    outsideScrollableContainer: boolean;
    lockPosition: boolean;
}
export declare class PositionedOverlay extends PureComponent<PositionedOverlayProps, State> {
    state: State;
    private overlay;
    private scrollableContainer;
    private observer;
    constructor(props: PositionedOverlayProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    forceUpdatePosition(): void;
    private overlayDetails;
    private setOverlay;
    private handleMeasurement;
}
export {};

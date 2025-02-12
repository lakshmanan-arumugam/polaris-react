/// <reference types="react" />
import type { IconSource } from '../../types';
declare type Color = 'base' | 'subdued' | 'critical' | 'interactive' | 'warning' | 'highlight' | 'success' | 'primary';
export interface IconProps {
    /** The SVG contents to display in the icon (icons should fit in a 20 × 20 pixel viewBox) */
    source: IconSource;
    /** Set the color for the SVG fill */
    color?: Color;
    /** Show a backdrop behind the icon */
    backdrop?: boolean;
    /** Descriptive text to be read to screenreaders */
    accessibilityLabel?: string;
}
export declare function Icon({ source, color, backdrop, accessibilityLabel }: IconProps): JSX.Element;
export {};

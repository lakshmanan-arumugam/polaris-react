/// <reference types="react" />
declare type Size = 'small' | 'medium' | 'large';
declare type Color = 'highlight' | 'primary' | 'success' | 'critical';
export interface ProgressBarProps {
    /**
     * The progression of certain tasks
     * @default 0
     */
    progress?: number;
    /**
     * Size of progressbar
     * @default 'medium'
     */
    size?: Size;
    /**
     * Color of progressbar
     * @default 'highlight'
     */
    color?: Color;
    /**
     * Whether the fill animation is triggered
     * @default 'true'
     */
    animated?: boolean;
}
export declare function ProgressBar({ progress, size, color, animated, }: ProgressBarProps): JSX.Element;
export {};

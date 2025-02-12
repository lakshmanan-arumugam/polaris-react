/// <reference types="react" />
declare type Size = 'extraSmall' | 'small' | 'medium' | 'large';
export declare const STYLE_CLASSES: string[];
export interface AvatarProps {
    /**
     * Size of avatar
     * @default 'medium'
     */
    size?: Size;
    /** The name of the person */
    name?: string;
    /** Initials of person to display */
    initials?: string;
    /** Whether the avatar is for a customer */
    customer?: boolean;
    /** URL of the avatar image which falls back to initials if the image fails to load */
    source?: string;
    /** Callback fired when the image fails to load  */
    onError?(): void;
    /** Accessible label for the avatar image */
    accessibilityLabel?: string;
}
export declare function Avatar({ name, source, onError, initials, customer, size, accessibilityLabel, }: AvatarProps): JSX.Element;
export {};

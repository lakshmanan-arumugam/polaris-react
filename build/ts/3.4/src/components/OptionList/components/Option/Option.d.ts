import React from 'react';
import { IconProps } from '../../../Icon';
import { ThumbnailProps } from '../../../Thumbnail';
import { AvatarProps } from '../../../Avatar';
declare type Alignment = 'top' | 'center' | 'bottom';
export interface OptionProps {
    id: string;
    label: React.ReactNode;
    value: string;
    section: number;
    index: number;
    media?: React.ReactElement<IconProps | AvatarProps | ThumbnailProps>;
    disabled?: boolean;
    active?: boolean;
    select?: boolean;
    allowMultiple?: boolean;
    verticalAlign?: Alignment;
    role?: string;
    onClick(section: number, option: number): void;
}
export declare function Option({ label, value, id, select, active, allowMultiple, disabled, role, media, onClick, section, index, verticalAlign, }: OptionProps): JSX.Element;
export {};

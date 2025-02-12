import React from 'react';
import { PopoverProps } from '../Popover';
import { TextFieldProps } from '../TextField';
import { ListboxProps } from '../Listbox';
export interface ComboboxProps {
    children?: React.ReactElement<ListboxProps> | null;
    activator: React.ReactElement<TextFieldProps>;
    allowMultiple?: boolean;
    onScrolledToBottom?(): void;
    preferredPosition?: PopoverProps['preferredPosition'];
}
export declare function Combobox({ children, activator, allowMultiple, onScrolledToBottom, preferredPosition, }: ComboboxProps): JSX.Element;
export declare namespace Combobox {
    var TextField: typeof import("./components").TextField;
}

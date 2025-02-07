/// <reference types="react" />
import { NavigableOption } from './types';
export interface ListboxContextType {
    onOptionSelect(option: NavigableOption): void;
    setLoading(label?: string): void;
}
export declare const ListboxContext: import("react").Context<ListboxContextType | undefined>;
export declare const WithinListboxContext: import("react").Context<boolean>;
export declare const ActionContext: import("react").Context<boolean>;

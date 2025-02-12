import React from 'react';
declare type RowStatus = 'success' | 'subdued';
export interface RowProps {
    children: React.ReactNode;
    id: string;
    selected?: boolean;
    position: number;
    subdued?: boolean;
    status?: RowStatus;
    onNavigation?(id: string): void;
}
export declare const Row: React.NamedExoticComponent<RowProps>;
export {};

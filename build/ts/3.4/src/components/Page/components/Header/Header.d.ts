import React from 'react';
import { MenuGroupDescriptor, MenuActionDescriptor, DestructableAction, DisableableAction, LoadableAction, IconableAction } from '../../../../types';
import { BreadcrumbsProps } from '../../../Breadcrumbs';
import { PaginationProps } from '../../../Pagination';
import { TitleProps } from './components';
interface PrimaryAction extends DestructableAction, DisableableAction, LoadableAction, IconableAction {
    /** Provides extra visual weight and identifies the primary action in a set of buttons */
    primary?: boolean;
}
export interface HeaderProps extends TitleProps {
    /** Visually hide the title */
    titleHidden?: boolean;
    /** Primary page-level action */
    primaryAction?: PrimaryAction | React.ReactNode;
    /** Page-level pagination */
    pagination?: PaginationProps;
    /** Collection of breadcrumbs */
    breadcrumbs?: BreadcrumbsProps['breadcrumbs'];
    /** Collection of secondary page-level actions */
    secondaryActions?: MenuActionDescriptor[];
    /** Collection of page-level groups of secondary actions */
    actionGroups?: MenuGroupDescriptor[];
    /** Additional navigation markup */
    additionalNavigation?: React.ReactNode;
    additionalMetadata?: React.ReactNode | string;
}
export declare function isPrimaryAction(x: PrimaryAction | React.ReactNode): x is PrimaryAction;
export declare function Header({ title, subtitle, titleMetadata, additionalMetadata, thumbnail, titleHidden, primaryAction, pagination, additionalNavigation, breadcrumbs, secondaryActions, actionGroups, compactTitle, }: HeaderProps): JSX.Element;
export {};

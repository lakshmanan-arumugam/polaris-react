/// <reference types="react" />
import { ActionListItemDescriptor, ActionListSection } from '../../../../types';
export interface SectionProps {
    /** Section of action items */
    section: ActionListSection;
    /** Should there be multiple sections */
    hasMultipleSections: boolean;
    /** Defines a specific role attribute for each action in the list */
    actionRole?: 'option' | 'menuitem' | string;
    /** Whether or not the section is the first to appear */
    firstSection?: boolean;
    /** Callback when any item is clicked or keypressed */
    onActionAnyItem?: ActionListItemDescriptor['onAction'];
}
export declare function Section({ section, hasMultipleSections, actionRole, firstSection, onActionAnyItem, }: SectionProps): JSX.Element;

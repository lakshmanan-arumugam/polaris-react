/// <reference types="react" />
import { IconProps } from '../../../Icon';
import { OptionProps } from '../Option';
interface ActionProps extends OptionProps {
    icon?: IconProps['source'];
}
export declare function Action(props: ActionProps): JSX.Element;
export {};

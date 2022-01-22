import React, { ReactElement } from 'react';
import { ListboxContext } from '../../src/utilities/listbox';
import { ComboboxListboxType } from '../../src/utilities/combobox';
export declare function mountWithListboxProvider(element: React.ReactElement, context?: React.ContextType<typeof ListboxContext>): import("@shopify/react-testing").CustomRoot<unknown, {
    context: import("../../src/utilities/listbox").ListboxContextType | undefined;
}>;
export declare function mountWithComboboxListContext(listbox: ReactElement, context?: ComboboxListboxType): import("@shopify/react-testing").CustomRoot<unknown, import("../../src/components/PolarisTestProvider").WithPolarisTestProviderOptions>;

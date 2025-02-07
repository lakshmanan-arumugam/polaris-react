export declare enum SelectionType {
    All = "all",
    Page = "page",
    Multi = "multi",
    Single = "single"
}
declare type Range = [number, number];
declare type ResourceIDResolver<T extends {
    [key: string]: unknown;
}> = (resource: T) => string;
export declare function useIndexResourceState<T extends {
    [key: string]: unknown;
}>(resources: T[], { selectedResources: initSelectedResources, allResourcesSelected: initAllResourcesSelected, resourceIDResolver, }?: {
    selectedResources?: string[];
    allResourcesSelected?: boolean;
    resourceIDResolver?: ResourceIDResolver<T>;
}): {
    selectedResources: string[];
    allResourcesSelected: boolean;
    handleSelectionChange: (selectionType: SelectionType, isSelecting: boolean, selection?: string | Range | undefined) => void;
};
export {};

interface StickyItem {
    /** Node of the sticky element */
    stickyNode: HTMLElement;
    /** Placeholder element */
    placeHolderNode: HTMLElement;
    /** Element outlining the fixed position boundaries */
    boundingElement?: HTMLElement | null;
    /** Offset vertical spacing from the top of the scrollable container */
    offset: boolean;
    /** Should the element remain in a fixed position when the layout is stacked (smaller screens)  */
    disableWhenStacked: boolean;
    /** Method to handle positioning */
    handlePositioning(stick: boolean, top?: number, left?: number, width?: string | number): void;
}
export declare class StickyManager {
    private stickyItems;
    private stuckItems;
    private container;
    private topBarOffset;
    private handleResize;
    private handleScroll;
    constructor(container?: Document | HTMLElement);
    registerStickyItem(stickyItem: StickyItem): void;
    unregisterStickyItem(nodeToRemove: HTMLElement): void;
    setContainer(el: Document | HTMLElement): void;
    removeScrollListener(): void;
    private manageStickyItems;
    private evaluateStickyItem;
    private updateStuckItems;
    private addStuckItem;
    private removeStuckItem;
    private getOffset;
    private isNodeStuck;
    private setTopBarOffset;
}
export {};

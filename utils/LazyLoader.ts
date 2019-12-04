// const $ = require('jquery');

// import { EventDispatcher } from "../events/EventDispatcher";
// import Event from "../events/Event";

// export class LazyLoader extends EventDispatcher {

//     private static instance: LazyLoader;
//     private currentIndex: number;

//     private constructor() {
//         super();

//         this.init();
//     }

//     public setup() {

//     }

//     public updateByScroll(scrollTop: number, prevScrollTop: number): void {
//         const down: boolean = (scrollTop - prevScrollTop) >= 0;

//         if (down) {
//             this.checkDown(scrollTop);
//         }
//         else {
//             this.checkUp(scrollTop);
//         }
//     }

//     public resize(): void {
//         this.sort();
//     }

//     public getCurrentIndex(): number {
//         return this.currentIndex;
//     }

//     private checkDown(scrollTop: number): void {
//         const nextIndex: number = this.currentIndex + 1;
//         if (nextIndex >= this.sections.length) return;

//         const $next: JQuery = this.sections[nextIndex];
//         const center: number = this.getCenterPosition(scrollTop);
//         const over:boolean = center > $next.offset().top;

//         if (over) {
//             this.currentIndex = nextIndex;
//             this.dispatchEvent(new Event(PositionManager.Change));

//             this.checkDown(scrollTop);
//         }
//     }

//     private checkUp(scrollTop: number): void {
//         const nextIndex: number = this.currentIndex;
//         if (nextIndex < 0) return;

//         const $next: JQuery = this.sections[nextIndex];
//         const center: number = this.getCenterPosition(scrollTop);
//         const over:boolean = center < $next.offset().top;

//         if (over) {
//             this.currentIndex = nextIndex - 1;
//             this.dispatchEvent(new Event(PositionManager.Change));

//             this.checkUp(scrollTop);
//         }
//     }

//     private init(): void {

//     }

//     private sort(): void {
//         this.sections.sort((a: JQuery, b: JQuery) => {
//             return (a.offset().top < b.offset().top ? -1 : 1);
//         });
//     }

//     public static getInstance(): LazyLoader {
//         if (!this.instance) {
//             this.instance = new LazyLoader();
//         }
//         return this.instance;
//     }
// }

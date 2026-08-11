declare module "react-notification-badge";
declare module "react-scrollable-feed";

interface VirtualKeyboard extends EventTarget {
  readonly boundingRect: DOMRect;
  overlaysContent: boolean;
}

interface Navigator {
  readonly virtualKeyboard?: VirtualKeyboard;
}

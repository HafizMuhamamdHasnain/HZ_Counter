declare module 'react-native-keyevent' {
  export function onKeyDownListener(callback: (keyCode: number) => void): void
  export function onKeyUpListener(callback: (keyCode: number) => void): void
  export function removeKeyDownListener(): void
  export function removeKeyUpListener(): void
}


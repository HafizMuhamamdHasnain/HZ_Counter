declare module 'react-native-system-setting' {
  type VolumeListenerData = { value: number }
  type VolumeListener = (data: VolumeListenerData) => void
  const SystemSetting: {
    getVolume: (type?: 'music' | 'system' | 'ring') => Promise<number>
    setVolume: (v: number, config?: { type?: 'music' | 'system' | 'ring'; playSound?: boolean; showUI?: boolean }) => Promise<void>
    addVolumeListener: (listener: VolumeListener, type?: 'music' | 'system' | 'ring') => any
    removeVolumeListener: (listener: any) => void
  }
  export default SystemSetting
}



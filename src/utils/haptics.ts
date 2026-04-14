import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const run = (fn: () => Promise<void>) => fn().catch(() => {});

export const haptic = {
  light:   () => run(() => Haptics.impact({ style: ImpactStyle.Light })),
  medium:  () => run(() => Haptics.impact({ style: ImpactStyle.Medium })),
  heavy:   () => run(() => Haptics.impact({ style: ImpactStyle.Heavy })),
  success: () => run(() => Haptics.notification({ type: NotificationType.Success })),
  warning: () => run(() => Haptics.notification({ type: NotificationType.Warning })),
};

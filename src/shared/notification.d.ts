declare module 'notification' {
  export const NotificationEnum = {
    System: 'System',
    Security: 'Security',
    AD: 'AD',
  } as const;

  export type NotificationType = keyof typeof NotificationEnum;

  export const NotificationValues = Object.values(NotificationEnum) as [
    string,
    ...string[],
  ];
}

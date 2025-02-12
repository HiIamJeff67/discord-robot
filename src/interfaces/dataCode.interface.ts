// make sure the default value of each name would be false
// since we set default privacySettingsCode to be 0
export interface PrivacySettingsCodeInterface {
  twoFactorEnabled: boolean;
  allowFriendRequest: boolean;
  allowMessages: boolean;
}

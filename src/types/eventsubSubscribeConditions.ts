// Exporteert alle interfaces voor de verschillende voorwaarden

export interface User {
  user_id: string;
  login?: string;
  name?: string;
}

export interface Moderator extends User { }

// Automod voorwaarden
export interface AutomodMessageHoldCondition {
  broadcaster_user_id: string;
  moderator_user_id: string;
}

export interface AutomodMessageUpdateCondition extends AutomodMessageHoldCondition { }

export interface AutomodSettingsUpdateCondition extends AutomodMessageHoldCondition { }

export interface AutomodTermsUpdateCondition extends AutomodMessageHoldCondition { }

// Kanaalvoorwaarden
export interface ChannelConditionBase {
  broadcaster_user_id: string;
}

export interface ChannelAdBreakBeginCondition extends ChannelConditionBase { }

export interface ChannelBanCondition extends ChannelConditionBase { }

export interface ChannelChatClearCondition extends ChannelConditionBase {
  user_id: string;
}

export interface ChannelChatClearUserMessagesCondition extends ChannelChatClearCondition { }

export interface ChannelChatMessageCondition extends ChannelChatClearCondition { }

export interface ChannelChatMessageDeleteCondition extends ChannelChatClearCondition { }

export interface ChannelChatNotificationCondition extends ChannelChatClearCondition { }

export interface ChannelChatSettingsUpdateCondition extends ChannelChatClearCondition { }

export interface ChannelChatUserMessageHoldCondition extends ChannelChatClearCondition { }

export interface ChannelChatUserMessageUpdateCondition extends ChannelChatClearCondition { }

export interface ChannelFollowCondition {
  broadcaster_user_id: string;
  moderator_user_id?: string;
}

export interface ChannelSubscriptionCondition extends ChannelConditionBase { }

export interface ChannelSubscriptionEndCondition extends ChannelConditionBase { }

export interface ChannelSubscriptionGiftCondition extends ChannelConditionBase { }

export interface ChannelSubscriptionMessageCondition extends ChannelConditionBase { }

export interface ChannelCheerCondition extends ChannelConditionBase { }

export interface ChannelUpdateCondition extends ChannelConditionBase { }

export interface ChannelUnbanCondition extends ChannelConditionBase { }

export interface ChannelUnbanRequestCreateCondition {
  moderator_user_id: string;
  broadcaster_user_id: string;
}

export interface ChannelUnbanRequestResolveCondition extends ChannelUnbanRequestCreateCondition { }

export interface ChannelRaidCondition {
  from_broadcaster_user_id?: string;
  to_broadcaster_user_id?: string;
}

export interface ChannelModerateEvent {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  moderator_user_id: string;
  moderator_user_login: string;
  moderator_user_name: string;
  action: string;
  // and many optional properties depending on the action
}

export interface ChannelModeratorAddCondition extends ChannelConditionBase { }

export interface ChannelModeratorRemoveCondition extends ChannelConditionBase { }

// Guest Star voorwaarden
export interface GuestStarConditionBase {
  broadcaster_user_id: string;
  moderator_user_id: string;
}

export interface ChannelGuestStarSessionBeginCondition extends GuestStarConditionBase { }

export interface ChannelGuestStarSessionEndCondition extends GuestStarConditionBase { }

export interface ChannelGuestStarGuestUpdateCondition extends GuestStarConditionBase { }

export interface ChannelGuestStarSettingsUpdateCondition extends GuestStarConditionBase { }

// Channel Points voorwaarden
export interface ChannelPointsConditionBase extends ChannelConditionBase { }

export interface ChannelPointsAutomaticRewardAddCondition extends ChannelPointsConditionBase { }

export interface ChannelPointsCustomRewardAddCondition extends ChannelPointsConditionBase { }

export interface ChannelPointsCustomRewardUpdateCondition extends ChannelPointsConditionBase {
  reward_id?: string;
}

export interface ChannelPointsCustomRewardRemoveCondition extends ChannelPointsConditionBase {
  reward_id?: string;
}

export interface ChannelPointsCustomRewardRedemptionAddCondition extends ChannelPointsConditionBase {
  reward_id?: string;
}

export interface ChannelPointsCustomRewardRedemptionUpdateCondition extends ChannelPointsConditionBase {
  reward_id?: string;
}

// Kanaal Poll voorwaarden
export interface ChannelPollConditionBase extends ChannelConditionBase { }

export interface ChannelPollBeginCondition extends ChannelPollConditionBase { }

export interface ChannelPollProgressCondition extends ChannelPollConditionBase { }

export interface ChannelPollEndCondition extends ChannelPollConditionBase { }

// Kanaal Prediction voorwaarden
export interface ChannelPredictionConditionBase extends ChannelConditionBase { }

export interface ChannelPredictionBeginCondition extends ChannelPredictionConditionBase { }

export interface ChannelPredictionProgressCondition extends ChannelPredictionConditionBase { }

// export interface ChannelPredictionLockCondition extends ChannelPrediction {}

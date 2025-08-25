// @generated ambient typing to widen hook return (no logic changes)
declare module '@/hooks/useSubscriptionAccess' {
  export type SubscriptionAccess = {
    canUsePremium: boolean;
    subscriptionStatus: string | null;
    plan: string | null;
    isLoading?: boolean;
    hasAccess?: boolean;
  };
  export function useSubscriptionAccess(): SubscriptionAccess;
}

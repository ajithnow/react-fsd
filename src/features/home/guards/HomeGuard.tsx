import { HomeGuardProps } from "./../models/guards.models";
export const HomeGuard = (props: HomeGuardProps) => {
  const canAccessHome = props.canAccess;

  if (!canAccessHome) {
    return <div>Access to home page is restricted</div>;
  }
 
  return <>{props.children}</>;
};

import { useRBAC } from '../hooks/useRBAC';
import { hasPermission } from '../utils/rbac.utils';
import { CanProps } from './Can.models';

/**
 * Declarative component for conditional rendering based on user permissions.
 * 
 * @example
 * <Can perform="users:create">
 *   <Button>Add User</Button>
 * </Can>
 */
export const Can: React.FC<CanProps> = ({ perform, children, no = null }) => {
  const { user } = useRBAC();

  if (hasPermission(user, perform)) {
    return <>{children}</>;
  }

  return <>{no}</>;
};

export default Can;

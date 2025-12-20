import PropTypes from 'prop-types';
import { useAuth } from '../hooks/use-auth';

export const PermissionGuard = (props) => {
  const { children, permissions } = props;
  const { isAuthenticated, user } = useAuth();

  // Here check the user permissions
  const canView = true;

  if (!isAuthenticated || !canView) {
    return null;
  }

  return <>{children}</>;
};

PermissionGuard.propTypes = {
  children: PropTypes.node,
  permissions: PropTypes.arrayOf(PropTypes.string),
};

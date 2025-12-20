import { RoleGuard } from '../guards/role-guard';

export const withRoleGuard = (Component) => (props) =>
  (
    <RoleGuard>
      <Component {...props} />
    </RoleGuard>
  );

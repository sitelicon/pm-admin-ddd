import { AuthGuard } from '../guards/auth-guard';
import { RoleGuard } from '../guards/role-guard';

export const withAuthGuard = (Component) => (props) =>
  (
    <AuthGuard>
      <RoleGuard>
        <Component {...props} />
      </RoleGuard>
    </AuthGuard>
  );

import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import { useSections } from '../layouts/dashboard/config';
import NotAllowedPage from '../pages/401';

const renderChildPaths = (items) => {
  return items.reduce((acc, item) => {
    if (item.items) {
      return [...acc, ...renderChildPaths(item.items)];
    }
    return [...acc, item.path];
  }, []);
};

export const RoleGuard = (props) => {
  const { children, permissions } = props;
  const { isAuthenticated, user } = useAuth();
  const sections = useSections();
  const pathname = usePathname();
  const items = sections
    .reduce((acc, section) => [...acc, ...section.items], [])
    .reduce(
      (acc, item) => [
        ...acc,
        {
          code: item.title,
          paths: [
            item.path,
            ...(item.items ? renderChildPaths(item.items) : []),
          ],
        },
      ],
      [],
    );
  const codes = user?.role?.menus?.map(({ code }) => code) || [];

  const canView = items.reduce((acc, item) => {
    if (acc) return acc;
    if (pathname === '/') return true;
    const checkPath = !!(item.paths && pathname && codes.includes(item.code));
    const partialMatch = checkPath
      ? item.paths.some((path) => path !== '/' && pathname.includes(path))
      : false;
    const exactMatch = checkPath
      ? item.paths.some((path) => pathname === path)
      : false;
    return partialMatch || exactMatch;
  }, false);

  if (!isAuthenticated || !canView) {
    return <NotAllowedPage />;
  }

  return <>{children}</>;
};

RoleGuard.propTypes = {
  children: PropTypes.node,
};

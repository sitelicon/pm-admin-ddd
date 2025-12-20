import PropTypes from 'prop-types';
import { withAuthGuard } from '../../hocs/with-auth-guard';
import { useSettings } from '../../hooks/use-settings';
import { useSections } from './config';
import { HorizontalLayout } from './horizontal-layout';
import { VerticalLayout } from './vertical-layout';
import { LanguagesProvider } from '../../contexts/languages-context';
import { StoresProvider } from '../../contexts/stores-context';

export const Layout = withAuthGuard((props) => {
  const settings = useSettings();
  const sections = useSections();

  return (
    <StoresProvider>
      <LanguagesProvider>
        {settings.layout === 'horizontal' ? (
          <HorizontalLayout
            sections={sections}
            navColor={settings.navColor}
            {...props}
          />
        ) : (
          <VerticalLayout
            sections={sections}
            navColor={settings.navColor}
            {...props}
          />
        )}
      </LanguagesProvider>
    </StoresProvider>
  );
});

Layout.propTypes = {
  children: PropTypes.node,
};

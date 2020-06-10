import { addLocaleData } from 'react-intl';
import esLang from './entries/es-ES';

const AppLocale = {
    es: esLang,
};
addLocaleData(AppLocale.es.data);

export default AppLocale;

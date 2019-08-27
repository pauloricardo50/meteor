import messagesFR from 'core/lang/fr.json';
import { Intl } from '../intl';

/**
 * formatMessage - A method to use the intl package
 *
 * @param {type}   id          the id of the message
 * @param {object} [values={}] any additional values you want to use in the
 * string
 *
 * @return {type} The formatted string
 */

const ServerIntl = new Intl(messagesFR);

export default ServerIntl;

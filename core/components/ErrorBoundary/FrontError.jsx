import React from 'react';
import Icon from '../Icon';
import Button from '../Button';

const { Front } = window;
const VPNError = () => (
  <>
    <h2 className="error">Connexion refusée !</h2>
    <div className="description">
      <p>
        La connexion au plugin e-Potek a échoué car votre adresse IP n'est pas
        autorisée. Merci de vérifier que vous êtes connecté:
        <ul>
          <li>Sur le WiFi e-Potek</li>
          <li>Ou sur le VPN e-Potek</li>
        </ul>
      </p>
    </div>
    <Button
      primary
      raised
      icon={<Icon type="help" />}
      onClick={() =>
        Front.openUrl(
          'https://www.notion.so/epotek/VPN-9798736f3daa42cb9eb09f75b184d044',
        )
      }
    >
      Comment me connecter au VPN ?
    </Button>
  </>
);

const FrontError = ({ error }) => {
  const isVPNError = error?.message.includes('Wrong IP');

  return (
    <div
      className="flex-col center animated jackInTheBox"
      style={{ padding: 16 }}
    >
      {isVPNError ? (
        VPNError()
      ) : (
        <>
          <h2 className="error">Woops une erreur!</h2>
          <div className="description">
            <p>
              Quelque chose n'a pas fonctionné comme prévu, on en est déjà
              informés.
            </p>
          </div>
          <div className="error" style={{ margin: 40 }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <h4>{error?.name}</h4>:
              <h3 style={{ marginLeft: 16 }}>{error?.message}</h3>
            </span>
            {error?.stack}
          </div>
        </>
      )}
    </div>
  );
};

export default FrontError;

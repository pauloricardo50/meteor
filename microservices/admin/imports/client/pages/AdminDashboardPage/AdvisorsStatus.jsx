import React from 'react';

import DialogSimple from 'core/components/DialogSimple/DialogSimple';
import Icon from 'core/components/Icon';
import IconButton from 'core/components/IconButton';

import { useAdmins } from '../../components/AdminsContext/AdminsContext';
import Advisor from '../../components/Advisor/Advisor';

const AdvisorsStatus = () => {
  const { advisors } = useAdmins();

  const notInRoundRobinAvailable = advisors.filter(
    ({ isInRoundRobin, roundRobinTimeout }) =>
      !isInRoundRobin && !roundRobinTimeout,
  );
  const inRoundRobin = advisors.filter(({ isInRoundRobin }) => isInRoundRobin);

  const available = inRoundRobin.filter(
    ({ roundRobinTimeout }) => !roundRobinTimeout,
  );
  const unavailable = advisors.filter(
    ({ roundRobinTimeout }) => roundRobinTimeout,
  );

  return (
    <div
      className="animated fadeIn flex-col"
      style={{ alignItems: 'flex-end' }}
    >
      <div className="flex center-align">
        <DialogSimple
          renderTrigger={({ handleOpen }) => (
            <IconButton
              type="info"
              size="small"
              color="primary"
              onClick={handleOpen}
              className="mr-4"
            />
          )}
          title="Comment on détermine qui sera le conseiller d'un nouveau client"
          closeOnly
        >
          <div className="flex-col center-align mb-16">
            <Icon type="supervisorAccount" size={100} color="primary" />
          </div>
          <h3>Règles de base</h3>
          <ol>
            <li>
              Si le client est invité sur une promotion, on l'assigne au
              conseiller de la promotion
            </li>
            <li>
              Si le client est invité par un Pro, on l'assigne au conseiller du
              Pro
            </li>
            <li>
              Si c'est un referral organique par une organisation, on l'assigne
              au conseiller de cette organisation
            </li>
          </ol>
          Ces règles sont appliquées dans l'ordre, c'est à dire que si un client
          est invité sur une promotion sans conseiller, on part sur le
          conseiller du Pro qui a fait l'invitation, etc.
          <br />
          <h3>Round robin</h3>
          Pour tous les autres clients, ou si aucun des cas dessus n'est
          valable, on envoie le client dans le round-robin. On va chercher le
          dernier client ajouté, assigné à un des conseillers dans le
          round-robin, et on assigne le nouveau client au suivant, chacun son
          tour.
          <h3>Vacances, ou pauses</h3>
          Lorsque tu es en vacances, ou si tu es surchargé et que tu veux
          temporairement sortir du round-robin, tu peux aller sur la page de ton
          compte (ou d'un de tes collègues, si nécessaire), et ajouter un texte
          dans la "Pause round-robin".
          <br />
          <br />
          Ce sera alors visible pour tout le monde que tu n'es pas dispo, avec
          la raison affichée en tooltip.
          <br />
          <br />
          Ça mettra aussi en pause les "Règles de base" plus haut pour toi.
        </DialogSimple>

        <h4 className="m-0">Conseillers</h4>
      </div>

      <div className="flex">
        <div className="flex-col" style={{ alignItems: 'flex-end' }}>
          <h5 className="secondary m-0">Dispo</h5>
          <div className="flex mb-8">
            {notInRoundRobinAvailable.map(({ _id }) => (
              <Advisor key={_id} advisorId={_id} className="ml-4" />
            ))}
          </div>
        </div>

        <div className="ml-16 flex-col" style={{ alignItems: 'flex-end' }}>
          <h5 className="secondary m-0">Round-robin</h5>
          <div className="flex mb-8">
            {available.map(({ _id }) => (
              <Advisor key={_id} advisorId={_id} className="ml-4" />
            ))}
          </div>
        </div>

        {unavailable.length > 0 && (
          <div className="ml-16 flex-col" style={{ alignItems: 'flex-end' }}>
            <h5 className="secondary m-0">Pas dispo</h5>
            <div className="flex">
              {unavailable.map(({ _id }) => (
                <Advisor key={_id} advisorId={_id} className="ml-4" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisorsStatus;

import React from 'react';

import DialogSimple from 'core/components/DialogSimple/DialogSimple';
import Icon from 'core/components/Icon';
import IconButton from 'core/components/IconButton';

import { useAdmins } from '../../components/AdminsContext/AdminsContext';
import Advisor from '../../components/Advisor/Advisor';

const AdvisorsStatus = () => {
  const { advisors } = useAdmins();

  const inRoundRobin = advisors.filter(({ isInRoundRobin }) => isInRoundRobin);

  const available = inRoundRobin.filter(
    ({ roundRobinTimeout }) => !roundRobinTimeout,
  );
  const unavailable = inRoundRobin.filter(
    ({ roundRobinTimeout }) => roundRobinTimeout,
  );

  return (
    <div className="animated fadeIn">
      <div className="flex align-items mb-8">
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

        <h4 className="m-0">Conseillers en round-robin</h4>
      </div>

      <div className="flex mb-8" style={{ justifyContent: 'flex-end' }}>
        {available.map(({ _id }) => (
          <Advisor key={_id} advisorId={_id} className="ml-4" />
        ))}
      </div>

      <div className="flex" style={{ justifyContent: 'flex-end' }}>
        {unavailable.map(({ _id }) => (
          <Advisor key={_id} advisorId={_id} className="ml-4" />
        ))}
      </div>
    </div>
  );
};

export default AdvisorsStatus;

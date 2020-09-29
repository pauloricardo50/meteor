import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';

import Button from '../Button';
import Icon from '../Icon';
import Dialog from '../Material/Dialog';
import List from '../Material/List';
import ListItem from '../Material/ListItem';
import T from '../Translation';

const BorrowerReuser = ({
  insertBorrower,
  reusableBorrowers = [],
  openModal,
  setOpenModal,
  isBorrower,
  linkBorrower,
}) => (
  <Dialog
    title={<T id="BorrowerAdder.reuser.dialogTitle" values={{ isBorrower }} />}
    open={openModal}
    actions={[
      <Button
        key="cancel"
        onClick={() => setOpenModal(false)}
        label="Annuler"
        raised
        primary
      />,
    ]}
  >
    <div className="flex-col center">
      <p className="description">
        <T
          defaultMessage="Vous pouvez ajouter un nouvel {isBorrower, select, true {emprunteur} other {assuré}} ou en réutiliser un déjà existant"
          values={{ isBorrower }}
        />
      </p>
      <Button
        onClick={insertBorrower}
        label={
          <T id="BorrowerAdder.reuser.newBorrower" values={{ isBorrower }} />
        }
        secondary
        raised
        icon={<Icon type="add" />}
        className="mb-32"
        style={{ maxWidth: '200px' }}
      />
      <h4>
        <T
          defaultMessage="Réutiliser un {isBorrower, select, true {emprunteur} other {assuré}} existant"
          values={{ isBorrower }}
        />
      </h4>
      <List className="flex-col" style={{ width: '100%' }}>
        {reusableBorrowers.map(
          ({ name, _id, loans = [], insuranceRequests = [] }) => (
            <ListItem key={_id} button onClick={() => linkBorrower(_id)}>
              <ListItemText
                primary={
                  name || (
                    <T
                      id="BorrowerAdder.reuser.borrowerNamePlaceholder"
                      values={{ isBorrower }}
                    />
                  )
                }
                secondary={[...loans, ...insuranceRequests]
                  .map(({ name: linkName }) => linkName)
                  .join(', ')}
              />
            </ListItem>
          ),
        )}
      </List>
    </div>
  </Dialog>
);

export default BorrowerReuser;

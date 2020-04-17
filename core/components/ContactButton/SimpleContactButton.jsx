import React, {useState} from 'react';
import Fab from '@material-ui/core/Fab';

import Icon from '../Icon';
import ContactButtonOverlay from './ContactButtonOverlay';
import SimpleContactButtonContainer from './SimpleContactButtonContainer';

const SimpleContactButton = props => {
    const [openContact, setOpenContact ] = useState(false);
    const handleCloseContact = () => setOpenContact(false);

    return (
        <div className="contact-button">
          <Fab
            onClick={event => {
              // Allow onClickAwayListener to work properly
              event.preventDefault();
              setOpenContact(!openContact);
            }}
            color="primary"
          >
            {openContact ? <Icon type="close" /> : <Icon type="forum" />}
          </Fab>
    
          <ContactButtonOverlay
            {...props}
            openContact={openContact}
            handleCloseContact={handleCloseContact}
          />
        </div>
      );
}

export default SimpleContactButtonContainer(SimpleContactButton)
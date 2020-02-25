import React, { useState } from 'react';
import Slide from '@material-ui/core/Slide';

import Dialog from '../core/components/Material/Dialog';
import Button from '../core/components/Button';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const FrontModal = props => {
  const {
    title,
    children,
    buttonProps = {},
    setOpen: setOpenOverride,
    open: openOverride,
  } = props;
  const withButton = !!Object.keys(buttonProps).length;
  const [open, setOpen] = useState(openOverride);

  return (
    <>
      {withButton && (
        <Button raised primary {...buttonProps} onClick={() => setOpen(true)} />
      )}
      <Dialog
        fullScreen
        title={
          <div className="flex center-align">
            <Button
              outlined
              primary
              onClick={() =>
                setOpenOverride ? setOpenOverride(false) : setOpen(false)
              }
            >
              &lt; Back
            </Button>
            <span className="ml-8">{title}</span>
          </div>
        }
        actions={[]}
        TransitionComponent={Transition}
        open={openOverride || open}
      >
        <div className="flex-col" style={{ alignItem: 'flex-start' }}>
          {children}
        </div>
      </Dialog>
    </>
  );
};

export default FrontModal;

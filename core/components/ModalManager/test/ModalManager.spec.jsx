// @flow
/* eslint-env mocha */
import React, { useContext } from 'react';
import { expect } from 'chai';
import Dialog from '@material-ui/core/Dialog';

import getMountedComponent from 'core/utils/testHelpers/getMountedComponent';

import ModalManager from '../ModalManager';
import ModalManagerContext from '../ModalManagerContext';

const TestComp = () => {
  const { openModal } = useContext(ModalManagerContext);
  return (
    <div>
      <button
        id="btn1"
        type="button"
        onClick={() =>
          openModal({
            content: <div className="dialog-1-content">Hello world</div>,
          })
        }
      >
        Click me
      </button>
      <button
        id="btn2"
        type="button"
        onClick={() =>
          openModal({
            content: <div className="dialog-2-content">Hello world</div>,
          })
        }
      >
        Click me
      </button>
      <button
        id="btn3"
        type="button"
        onClick={() =>
          openModal([
            { content: <div className="dialog-3-content">Hello world</div> },
            { content: <div className="dialog-4-content">Hello world</div> },
            { content: <div className="dialog-5-content">Hello world</div> },
          ])
        }
      >
        Click me
      </button>
      <button
        id="btn4"
        type="button"
        onClick={() =>
          openModal([
            {
              content: <div className="dialog-6-content">Hello world</div>,
              actions: ({ closeModal }) => (
                <button
                  type="button"
                  className="dialog-close"
                  onClick={() =>
                    new Promise(res => {
                      res('Promise worked!');
                    }).then(closeModal)
                  }
                >
                  Close me
                </button>
              ),
            },
            {
              content: ({ returnValue }) => (
                <div className="dialog-7-content">{returnValue}</div>
              ),
            },
          ])
        }
      >
        Click me
      </button>
    </div>
  );
};

describe('ModalManager', () => {
  const component = () =>
    getMountedComponent({
      Component: props => (
        <ModalManager>
          <TestComp {...props} />
        </ModalManager>
      ),
    });

  const closeDialog = () =>
    component()
      .find('.dialog-close')
      .first()
      .simulate('click');

  beforeEach(() => {
    getMountedComponent.reset();
  });

  after(() => {
    // Avoid polluting test reporting UI with an open Modal
    closeDialog();
  });

  it('opens a modal', () => {
    component()
      .find('button')
      .first()
      .simulate('click');

    expect(component().find('.dialog-1-content').length).to.equal(1);
    expect(
      component()
        .find('.dialog-1-content')
        .text(),
    ).to.equal('Hello world');
  });

  it('closes a modal', () => {
    component()
      .find('button')
      .first()
      .simulate('click');

    expect(component().find('.dialog-1-content').length).to.equal(1);
    closeDialog();

    expect(component().find('.dialog-1-content').length).to.equal(0);
  });

  it('opens 2 modals one after the other', () => {
    component()
      .find('#btn1')
      .first()
      .simulate('click');

    component()
      .find('#btn2')
      .last()
      .simulate('click');

    expect(component().find('.dialog-1-content').length).to.equal(1);

    closeDialog();

    expect(component().find('.dialog-2-content').length).to.equal(1);

    closeDialog();

    expect(
      component()
        .find(Dialog)
        .prop('open'),
    ).to.equal(false);
  });

  it('allows passing an array of modals', () => {
    component()
      .find('#btn3')
      .first()
      .simulate('click');

    expect(component().find('.dialog-3-content').length).to.equal(1);

    closeDialog();

    expect(component().find('.dialog-4-content').length).to.equal(1);

    closeDialog();

    expect(component().find('.dialog-5-content').length).to.equal(1);

    closeDialog();

    expect(
      component()
        .find(Dialog)
        .prop('open'),
    ).to.equal(false);
  });

  it('can pass values between modals', done => {
    component()
      .find('#btn4')
      .first()
      .simulate('click');

    expect(component().find('.dialog-6-content').length).to.equal(1);

    closeDialog();

    // Wait for the promise to resolve
    setTimeout(() => {
      component().update();

      expect(component().find('.dialog-7-content').length).to.equal(1);
      expect(
        component()
          .find('.dialog-7-content')
          .text(),
      ).to.equal('Promise worked!');

      closeDialog();

      expect(
        component()
          .find(Dialog)
          .prop('open'),
      ).to.equal(false);

      done();
    }, 0);
  });
});

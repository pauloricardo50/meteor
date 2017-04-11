import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import DropzoneArray from '/imports/ui/components/general/DropzoneArray.jsx';

export default class Files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: -1,
    };

    this.getArrray = this.getArray.bind(this);
  }

  getArray() {
    return [
      {
        title: '3 Fiches de salaire',
        folderName: 'buyersContract',
        currentValue: this.props.borrower.files.lastSalaries,
        id: 'files.lastSalaries',
      },
      {
        title: "Pièce d'identité",
        folderName: 'identity',
        currentValue: this.props.borrower.files.identity,
        id: 'files.identity',
      },
      {
        title: "Déclaration d'impôts (dev)",
        files: 3,
        done: false,
      },
      {
        title: "Extrait de l'office des poursuites (dev)",
        files: 1,
        done: false,
      },
    ];
  }

  render() {
    return (
      <section className="animated fadeIn">
        <hr />
        <h2 className="text-center">Mes Documents</h2>

        <div className="description">
          <p>
            <div className="text-center">
              <span className="fa fa-lock fa-3x" />
            </div>
            <br />
            Voici l'endroit où vous pouvez uploader vos document en toute confidentialité. Votre conseiller attitré
            {' '}
            <Link to="/app/contact" className="active">Yannis</Link>
            {' '}
            est le seul à y avoir accès.
          </p>
        </div>

        <DropzoneArray
          array={this.getArray()}
          documentId={this.props.borrower._id}
          pushFunc="pushBorrowerValue"
          collection="borrowers"
        />

      </section>
    );
  }
}

Files.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};

import React, { Component, PropTypes } from 'react';


import DropzoneArray from '/imports/ui/components/general/DropzoneArray.jsx';

export default class Step3FileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: -1,
    };

    this.handleClick = this.handleClick.bind(this);
    this.getArrray = this.getArray.bind(this);
  }

  getArray() {
    const r = this.props.loanRequest;

    return [
      {
        title: 'Acte d\'achat',
        folderName: 'buyersContract',
        currentValue: r.general.files.buyersContract,
        id: 'general.files.buyersContract',
      },
      {
        title: 'Identité',
        files: 21,
        done: false,
      },
      {
        title: 'Plans',
        files: 0,
        done: false,
      },
      {
        title: 'Fiches de salaire',
        files: 3,
        done: false,
      },
      {
        title: 'Extrait de l\'office des poursuites',
        files: 1,
        done: false,
      },
      {
        title: 'Fiches de salaire',
        files: 1,
        done: false,
      },
      {
        title: 'Copie d\'acte d\'achat',
        files: 2,
        done: false,
      },
    ];
  }

  handleClick(i) {
    if (this.state.active === i) {
      this.setState({ active: -1 });
    } else {
      this.setState({ active: i });
    }
  }


  render() {
    const twoBorrowers = this.props.loanRequest.borrowers.length > 1;

    return (
      <section className="mask1">
        <h1>{twoBorrowers ? 'Nos documents' : 'Mes documents'}</h1>

        <DropzoneArray array={this.getArray()} requestId={this.props.loanRequest._id} />

      </section>
    );
  }
}

Step3FileUpload.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

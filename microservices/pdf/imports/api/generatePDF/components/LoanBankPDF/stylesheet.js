const flexRow = `display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
        -ms-flex-direction: row;
            flex-direction: row;`;

const flexColumn = `display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;`;

const alignItemsCenter = `-webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;`;

const justifyContentFlexStart = `-webkit-box-pack: start;
        -ms-flex-pack: start;
            justify-content: flex-start;`;

const justifyContentSpaceBetween = `-webkit-box-pack: justify;
        -ms-flex-pack: justify;
            justify-content: space-between;`;

const justifyContentFlexEnd = `    -webkit-box-pack: end;
        -ms-flex-pack: end;
            justify-content: flex-end`;

const justifyContentCenter = `-webkit-box-pack: center;
    -ms-flex-pack: center;
        justify-content: center;`;

const justifyContentSpaceEvenly = `-webkit-box-pack: space-evenly;
        -ms-flex-pack: space-evenly;
            justify-content: space-evenly;`;

const justifyContentSpaceAround = `    -ms-flex-pack: distribute;
        justify-content: space-around;`;

const RecapStyleSheet = `
.validator {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: stretch;
      -ms-flex-align: stretch;
          align-items: stretch;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;

  width: 100%;
  max-width: 400px;
  min-height: 140px;
}

.validator label {
  width: 100%;
  margin: 0;
  margin-top: 16px;
}

.validator p:first-child {
  margin: auto;

  text-align: left;
}

.validator .result {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
      -ms-flex-align: start;
          align-items: flex-start;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;

  width: 100%;
}

.validator .result div {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;

  width: 100%;
  margin: 0;

  -webkit-transition: all 0.2s $bezier;

  -o-transition: all 0.2s $bezier;

  transition: all 0.2s $bezier;
}

.validator .result div p:last-of-type {
  -ms-flex-negative: 0;
      flex-shrink: 0;

  margin: 0;
}

.validator .result div p:first-of-type {
  margin: 0;
}

.validator .result div p span.sum {
  margin-top: 16px;
  padding-top: 4px;

  border-top: solid 1px #808080;
}

.validator .result div p .fa {
  width: 21px;

  text-align: center;
}

.validator .result div:hover {
  -webkit-transform: scale(1.03);
      -ms-transform: scale(1.03);
          transform: scale(1.03);

  opacity: 1;
  color: #000;
}

.validator .result div:hover.no-scale {
  -webkit-transform: none;
      -ms-transform: none;
          transform: none;
}

.validator .result div:hover p,
.validator .result div:hover p {
  opacity: inherit;
  color: inherit;
}

.recap {
    max-width: 200px;
}`;

const stylesheet = `
    html {
        font-size: 10px;
    }
    .loan-bank-pdf {
        ${flexColumn}
        ${alignItemsCenter}
        ${justifyContentFlexStart}
        width: 500px;
        height: auto;
    }
    .loan-bank-pdf-page {
        ${flexColumn}
        ${justifyContentFlexStart}
        height: 720px;
        width: 100%;
    }
    .loan-bank-pdf-page-content {
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1
    }
    .loan-bank-pdf-header {
        ${flexRow}
        ${alignItemsCenter}
        ${justifyContentSpaceBetween}
        width: 100%;
    }
    .loan-bank-pdf-info {
        ${flexRow}
        ${alignItemsCenter}
        ${justifyContentFlexEnd}
        width: 100%;
        text-transform: uppercase;
    }
    .loan-bank-pdf-recaps {
        ${flexColumn}
        ${justifyContentFlexStart}
        width:100%;
    }
    .loan-bank-pdf-borrowers {
        ${flexColumn}
        ${justifyContentFlexStart}
        width: 100%;
        margin-bottom: 16px;
        -webkit-column-break-after: always;
        break-after: always;
        page-break-after: always;
    }
    .loan-bank-pdf-borrowers-recap {
        ${flexRow}
        ${justifyContentSpaceBetween}
        width: 100%;
    }
    .loan-bank-pdf-recap-single {
        width: 50%;
    }
    .loan-bank-pdf-section-title {
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1
        text-transform: uppercase;
        background-color: #fafafa;
        padding: 8px;
        padding-left: 4px;
    }
    .loan-bank-pdf-project {
        ${flexColumn}
        ${justifyContentCenter}
         -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1
        margin-bottom: 16px;
    }
    .loan-bank-pdf-project-recap {
        ${flexRow}
        ${justifyContentSpaceAround}
         -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1
    }
    .loan-bank-pdf-property {
        ${flexColumn}
        ${justifyContentFlexStart}
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -ms-flex-preferred-size: 50%;
        flex-basis: 50%;
        -ms-flex-negative: 0;
        flex-shrink: 0;
    }
    .loan-bank-pdf-property-table {
        font-size: 10px;
    }
    .loan-bank-pdf-project-details {
        ${flexColumn}
        ${justifyContentFlexStart}
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -ms-flex-preferred-size: 50%;
        flex-basis: 50%;
        -ms-flex-negative: 0;
        flex-shrink: 0;
    }
    .loan-bank-pdf-project-table {
        font-size: 10px;
    }
    .loan-bank-pdf-footer {
        ${flexRow}
        ${alignItemsCenter}
        ${justifyContentCenter}
        -ms-flex-item-align: end;
        align-self: flex-end;
    }

    ${RecapStyleSheet}
`;

export default stylesheet;

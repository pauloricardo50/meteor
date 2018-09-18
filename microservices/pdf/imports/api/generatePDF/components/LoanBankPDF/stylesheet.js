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

const stylesheet = `
    .loan-bank-pdf {
        width: 500px;
        ${flexColumn}
        ${alignItemsCenter}
        ${justifyContentFlexStart}
    }
    .loan-bank-pdf-header {
        width: 100%;
        ${flexRow}
        ${alignItemsCenter}
        ${justifyContentSpaceBetween}
    }
    .loan-bank-pdf-info {
        width: 100%;
        ${flexRow}
        ${alignItemsCenter}
        ${justifyContentFlexEnd}
        text-transform: uppercase;
    }
`;

export default stylesheet;

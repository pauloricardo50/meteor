export const FLEX_ROW = `
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
`;

export const FLEX_COLUMN = `
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
`;

export const ALIGN_ITEMS_CENTER = `
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
`;

export const ALIGN_ITEMS_FLEX_END = `
    -webkit-box-align: end;
    -ms-flex-align: end;
    align-items: flex-end;
`;

export const JUSTIFY_CONTENT_FLEX_START = `
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
`;

export const JUSTIFY_CONTENT_SPACE_BETWEEN = `
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
`;

export const JUSTIFY_CONTENT_FLEX_END = `
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
`;

export const JUSTIFY_CONTENT_CENTER = `
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
`;

export const JUSTIFY_CONTENT_SPACE_EVENLY = `
    -webkit-box-pack: space-evenly;
    -ms-flex-pack: space-evenly;
    justify-content: space-evenly;
`;

export const JUSTIFY_CONTENT_SPACE_AROUND = `
    -ms-flex-pack: distribute;
    justify-content: space-around;
`;

export const ALIGN_SELF_FLEX_END = `
    -ms-flex-item-align: end;
    align-self: flex-end;
`;

export const flexGrow = size => `
    -webkit-box-flex: ${size};
    -ms-flex-positive: ${size};
    flex-grow: ${size};
`;

export const flexBasis = basis => `
    -ms-flex-preferred-size: ${basis};
    flex-basis: ${basis};
`;

export const flexShrink = size => `
    -ms-flex-negative: ${size};
    flex-shrink: ${size};
`;

export const FLEXBOX = {
  FLEX_ROW,
  FLEX_COLUMN,
  ALIGN_ITEMS_CENTER,
  ALIGN_ITEMS_FLEX_END,
  JUSTIFY_CONTENT_FLEX_START,
  JUSTIFY_CONTENT_SPACE_BETWEEN,
  JUSTIFY_CONTENT_FLEX_END,
  JUSTIFY_CONTENT_CENTER,
  JUSTIFY_CONTENT_SPACE_EVENLY,
  JUSTIFY_CONTENT_SPACE_AROUND,
};

export const flex = options =>
  options.reduce((style, option) => `${style} ${FLEXBOX[option]}`, '');

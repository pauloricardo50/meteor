// @flow
import React from 'react';

type PromotionLogosProps = {
  logoUrls: Array,
};

// This component expects to be put inside a tbody:

/* <table
    align="left"
    border="0"
    cellPadding="0"
    cellSpacing="0"
    style="max-width:100%; min-width:100%;"
    width="100%"
    className="mcnTextContentContainer"
  >
    <tbody mc:edit="logos" />
  </table>; */

const PromotionLogos = ({ logoUrls }: PromotionLogosProps) => (
  <>
    {logoUrls.map((url, index) => (
      <tr key={url}>
        <td align="center">
          <img
            style={{ width: 150, maxHeight: 50, marginBottom: 16 }}
            src={url}
            alt={`Logo promotion${index + 1}`}
          />
        </td>
      </tr>
    ))}
  </>
);

export default PromotionLogos;

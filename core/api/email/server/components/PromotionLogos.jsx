import React from 'react';

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

const PromotionLogos = ({ logoUrls }) => (
  <>
    {logoUrls.map((url, index) => (
      <tr key={url}>
        <td align="center">
          <img
            style={{ maxWidth: 150, maxHeight: 50, marginBottom: 16 }}
            src={url}
            alt={`Logo promotion${index + 1}`}
          />
        </td>
      </tr>
    ))}
  </>
);

export default PromotionLogos;

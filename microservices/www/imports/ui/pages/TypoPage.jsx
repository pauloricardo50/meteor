import React from 'react';

// Make it easy to check if our typography is accurate on all devices
const TypoPage = () => (
  <div style={{ padding: 40 }}>
    <div className="flex-col">
      <h1>
        Title 1 <small>small</small>
      </h1>
      <h2>
        Title 2 <small>small</small>
      </h2>
      <h3>
        Title 3 <small>small</small>
      </h3>
      <h4>
        Title 4 <small>small</small>
      </h4>
      <h5>
        Title 5 <small>small</small>
      </h5>
      <p>
        Body ö à é [] <small>small</small>
      </p>
      <br />
      <b>Bold</b>
      <br />
      <strong>Strong</strong>
      <br />
      <i>Italic</i>
      <br />
      <em>Emphasis</em>
      <br />

      <span className="numeric">2222.22 aaa</span>
      <span className="numeric">1111.11 iii</span>
    </div>
  </div>
);

export default TypoPage;

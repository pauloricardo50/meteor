const recapStyleSheet = `
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

export default recapStyleSheet;

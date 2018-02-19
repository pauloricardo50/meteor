import ReactDOMServer from 'react-dom/server';
import pdf from 'html-pdf';
import fs from 'fs';

let thisModule;

const getBase64String = (path) => {
  try {
    const file = fs.readFileSync(path);
    return new Buffer(file).toString('base64');
  } catch (exception) {
    thisModule.reject(exception);
  }
};

const generatePDF = (html, fileName) => {
  try {
    pdf
      .create(html, {
        format: 'A4',
        border: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
      })
      .toFile(`./tmp/${fileName}`, (error, response) => {
        if (error) {
          thisModule.reject(error);
        } else {
          thisModule.resolve({
            fileName,
            base64: getBase64String(response.filename),
          });
          fs.unlink(response.filename);
        }
      });
  } catch (exception) {
    thisModule.reject(exception);
  }
};

const getComponentAsHTML = (component, props) => {
  try {
    return ReactDOMServer.renderToStaticMarkup(component(props));
  } catch (exception) {
    thisModule.reject(exception);
  }
};

const handler = ({ component, props, fileName }, promise) => {
  thisModule = promise;
  const html = getComponentAsHTML(component, props);
  if (html && fileName) {
    generatePDF(html, fileName);
  }
};

export const generateComponentAsPDF = options =>
  new Promise((resolve, reject) => handler(options, { resolve, reject }));

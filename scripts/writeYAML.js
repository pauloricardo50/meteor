import yaml from 'write-yaml';

const writeYAML = ({ file, data }) =>
  new Promise((resolve, reject) =>
    yaml(file, data, error => (error ? reject(error) : resolve())),
  );

export default writeYAML;

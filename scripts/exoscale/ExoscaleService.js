import * as queryString from 'query-string';
import crypto from 'crypto';
import fetch from 'node-fetch';

import * as exoscaleConstants from './exoscaleConstants';

import exoscaleCommands from './commands';

export default class ExoscaleService {
  createNewHmac() {
    this.hmac = crypto.createHmac(
      'sha1',
      Buffer.from(exoscaleConstants.API_SECRET).toString('utf-8'),
    );
  }

  generateHmacSignature(command) {
    this.createNewHmac();
    this.hmac.update(Buffer.from(queryString.stringify(command).toLowerCase()).toString('utf-8'));
    return Buffer.from(this.hmac.digest()).toString('base64');
  }

  execute({ request, apiUrl }) {
    const command = { ...request, apikey: exoscaleConstants.API_KEY };
    const signature = this.generateHmacSignature(command);
    const query = queryString.stringify({ ...command, signature });

    return this.getData({ query, apiUrl }).then(data => data.json());
  }

  getData({ query, apiUrl }) {
    return fetch(apiUrl + query, { method: 'GET' });
  }

  listServiceOfferings() {
    return this.execute({
      request: exoscaleCommands.listServiceOfferings(),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handleListServiceOfferingsResponse);
  }

  handleListServiceOfferingsResponse({
    listserviceofferingsresponse: { serviceoffering },
  }) {
    if (!serviceoffering) {
      throw new Error('Could not find any service offering');
    }

    return serviceoffering;
  }

  listTemplates(options) {
    return this.execute({
      request: exoscaleCommands.listTemplates(options),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handleListTemplatesResponse);
  }

  handleListTemplatesResponse({
    listtemplatesresponse: { template, errortext },
  }) {
    if (errortext) {
      throw new Error(`Could not find any template: ${errortext}`);
    }

    return template;
  }

  listTemplatesAndFilterByName({ options, filter }) {
    return this.listTemplates(options).then(templates =>
      templates.filter(template => template.name.includes(filter)));
  }

  createSSHKeyPair(options) {
    return this.execute({
      request: exoscaleCommands.createSSHKeyPair(options),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handleCreateSSHKeyPairResponse);
  }

  handleCreateSSHKeyPairResponse({
    createsshkeypairresponse: { keypair, errortext },
  }) {
    if (errortext) {
      throw new Error(`SSH Keypair creation failed: ${errortext}`);
    }

    return `SSH Private key:\n${keypair.privatekey}`;
  }

  deleteSSHKeyPair(options) {
    return this.execute({
      request: exoscaleCommands.deleteSSHKeyPair(options),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handleDeleteSSHKeyPairResponse);
  }

  handleDeleteSSHKeyPairResponse({ deletesshkeypairresponse: { errortext } }) {
    if (errortext) {
      throw new Error(`SSH Keypair deletion failed: ${errortext}`);
    }

    return 'Success';
  }

  listSSHKeyPairs(options) {
    return this.execute({
      request: exoscaleCommands.listSSHKeyPairs(options),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handleListSSHKeyPairs);
  }

  handleListSSHKeyPairs({ listsshkeypairsresponse: { sshkeypair, count } }) {
    if (!sshkeypair || count === 0) {
      throw new Error('No SSH key pairs found');
    }

    return sshkeypair;
  }

  deployVirtualMachine(options) {
    return this.execute({
      request: exoscaleCommands.deployVirtualMachine(options),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handleDeployVirtualMachine);
  }

  handleDeployVirtualMachine({ deployvirtualmachineresponse: { errortext } }) {
    if (errortext) {
      throw new Error(`Virtual machine deployment failed: ${errortext}`);
    }

    return 'Succes';
  }

  createSecurityGroup(options) {
    return this.execute({
      request: exoscaleCommands.createSecurityGroup(options),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handleCreateSecurityGrouprResponse);
  }

  handleCreateSecurityGrouprResponse({
    createsecuritygroupresponse: { securitygroup, errortext },
  }) {
    if (errortext) {
      throw new Error(`Security group creation failed: ${errortext}`);
    }

    return securitygroup;
  }

  listSecurityGroups() {
    return this.execute({
      request: exoscaleCommands.listSecurityGroups(),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handleListSecurityGroups);
  }

  handleListSecurityGroups({
    listsecuritygroupsresponse: { securitygroup, count },
  }) {
    if (!securitygroup || count === 0) {
      throw new Error('No security group found');
    }

    return securitygroup;
  }

  // TODO: here

  handleAuthorizeSecurityGroupIngressResponse(response) {
    const {
      authorizesecuritygroupingressresponse: { jobid, errortext },
    } = response;

    if (errortext) {
      return Promise.reject(new Error(`Security group ingress authorization failed: ${errortext}`));
    }

    return Promise.resolve(jobid);
  }

  authorizeSecurityGroupIngress(options) {
    return this.execute({
      request: exoscaleCommands.authorizeSecurityGroupIngress(options),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handleAuthorizeSecurityGroupIngressResponse);
  }

  associateIpAddress(options) {
    return this.execute({
      request: exoscaleCommands.associateIpAddress(options),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    });
  }

  handlelistPublicIpAddressesResponse({
    listpublicipaddressesresponse: { publicipaddress },
  }) {
    if (!publicipaddress) {
      return Promise.reject(new Error('No public IP addresses found'));
    }

    return Promise.resolve(publicipaddress);
  }

  listPublicIpAddresses(options) {
    return this.execute({
      request: exoscaleCommands.listPublicIpAddresses(options),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handlelistPublicIpAddressesResponse);
  }

  handlelistNics(response) {
    const {
      listnicsresponse: { nic },
    } = response;

    if (!nic) {
      return Promise.reject(new Error('No NIC found'));
    }

    return Promise.resolve(nic);
  }

  listNics({ virtualMachineId: virtualmachineid }) {
    return this.execute({
      request: exoscaleCommands.listNics({ virtualmachineid }),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handlelistNics);
  }

  handlelistVirtualMachinesByName(response) {
    const {
      listvirtualmachinesresponse: { virtualmachine },
    } = response;

    if (!virtualmachine) {
      return Promise.reject(new Error('No virtual machine found'));
    }

    return Promise.resolve(virtualmachine);
  }

  listVirtualMachinesByName({ name }) {
    return this.execute({
      request: exoscaleCommands.listVirtualMachines({ name }),
      apiUrl: exoscaleConstants.API_URL.COMPUTE,
    }).then(this.handlelistVirtualMachinesByName);
  }

  getVirtualMachineIdByName({ name }) {
    return this.listVirtualMachinesByName(name).then(response =>
      Promise.resolve(response[0].id));
  }
}

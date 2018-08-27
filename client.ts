// const rp = require('request-promise');
import * as rp from 'request-promise';

export default class Client {
  //define var otherwise  error TS2339: Property 'accessKey' does not exist on type 'Client'.
  uri: string = 'https://api.shootandprove.com/';
  accessKey: string;
  secretKey: string;
  cookieJar: any;
  auth: boolean = false;
  me: object;
  tasks: object;

  constructor(accessKey: string, secretKey: string){
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.cookieJar = rp.jar();
  }

  // dev method to set to developement url
  setEndpoint(uri: string) {
    this.uri = uri;
  }

  setBeta(active: boolean = true) {
    if (active) {
      this.uri = 'https://beta.api.shootandprove.com/';
    } else {
      this.uri = 'https://api.shootandprove.com/';
    }
  }

  async testCredentials(){
    this.me = await rp({
      method: 'POST',
      uri: `${this.uri}api/auth`,
      body: {
        'accessKey': this.accessKey,
        'secretKey': this.secretKey
      },
      json: true,
      jar: this.cookieJar
    });
    this.auth = true;
    return this.me;
  }

  async getMe(){
    // generic auth method before any request
    if (!this.auth) {
      await this.testCredentials();
    }
    return rp({
      method: 'GET',
      uri: `${this.uri}me`,
      json: true,
      jar: this.cookieJar
    }); 
  }

  // option: sync = all, tasks = inbox, trash = trashed tasks, archives = history
  async getTasks(option: string):Promise<object>{
      // generic auth method before any request
      if (!this.auth) {
        await this.testCredentials();
      }
      this.tasks = await rp({
        method: 'GET',
        uri: `${this.uri}me/${option}`,
        json: true,
        jar: this.cookieJar
      }); 
      return this.tasks;
  }

  async pushTask(template: string, ident: string, type: string):Promise<object>{
    // generic auth method before any request
    if (!this.auth) {
      await this.testCredentials();
    }
    return rp({
      method: 'POST',
      uri: `${this.uri}templates/${template}/push`,
      body: {
        'ident': ident,
        'type': type
      },
      json: true,
      jar: this.cookieJar
    });
  }
}
export {Client};
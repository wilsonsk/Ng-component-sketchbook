import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';

import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

import { AuthenticationState } from './authentication-state.model';

@Injectable()
export class AuthenticationProvider {
  state: AuthenticationState;

  constructor(private http: HttpClient, private storage: Storage, private file: File) {}

  public fetchTokenFromDeviceStorage() {
    return this.storage.get('drivelyToken')
      .then((token) => {
        if(token) {
          // alert('fetch token successful');
          return token;
        } else {
          // alert('fetch token successful, but token is empty')
          return token;
        }
      })
      .catch((error) => {
        alert('failed to fetch token');
        return 0;
      });
  }

  public isTokenExpired(token: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .append('Authorization', token);
    const options = {
      headers: headers
    };
    return this.http.get('http://ua/TEST-drively-api/sites/_admin/api/v1/isTokenExpired', options);
  }

  public fetchCompanyFromToken(token: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .append('Authorization', token);
    const options = {
      headers: headers
    };
    return this.http.get('http://ua/TEST-drively-api/sites/_admin/api/v1/getCompanyFromToken', options);
  }

  public checkCompanyCode(company: string, code: string) {
    return this.http.get('http://ua/TEST-drively-api/sites/_admin/api/v1/checkCompanyCode' + '/' + company + '/' + code);
  }

  public setAuth(company: string, code: string) {
    this.state.company = company;
    this.state.code = code;
  }

  public saveTokenToDeviceStorage(token: any) {
    this.storage.set('drivelyToken', token)
      .then(() => {
        // alert('save token to device successful');
      })
      .catch((error) => {
        alert('save token to device failed');
      });
  }

}

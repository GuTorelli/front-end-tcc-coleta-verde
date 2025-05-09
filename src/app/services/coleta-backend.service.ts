import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export enum EColetaRole {
  user,
  employee,
  enterprise,
  admin
}


interface IColetaBackendResponse<T> {
  message?: string;
  data?: T;
  status: number;
}

export interface IColetaAddress {
  cep: string,
  logradouro: string,
  complemento: string,
  unidade: string,
  bairro: string,
  localidade: string,
  uf: string,
  estado: string,
  regiao: string
}

export interface IColetaUser {
  id: number,
  email: string,
  verified: boolean,
  description: string,
  name: string,
  password: string,
  role: EColetaRole,
  addresses: IColetaAddress[],
  createdAt: number,
  rating: number,
  completedSolicitations?: number,
  cpf?: string,
  cnpj?: string
}

@Injectable({
  providedIn: 'root'
})
export class ColetaBackendService {
  private readonly url = 'http://localhost:8080'; /* Isso aqui vai mudar em produ o */
  private token: string = '';

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token') ?? '';
  }

  /**
   * Seta o token de autentição do usuário
   *
   * @param value O token de autenticação do usuário
   */
  public set setToken(value: string) {
    this.token = value;
    localStorage.setItem('token', value);
  }

  /**
   * @returns O token de autenticação do usuário armazenado
   */
  public get getToken(): string {
    return this.token;
  }

  private rawRequest(method: string, path: string, body?: any): Observable<IColetaBackendResponse<any>> {
    let headers = new HttpHeaders();
    if (!this.token) this.token = localStorage.getItem('token') ?? '';
    headers = headers.set('Authorization', `Bearer ${this.token}`);

    return this.http.request(method, this.url + path, { headers, body }) as Observable<IColetaBackendResponse<any>>;
  }

  /**
   * Faz o login do usuário
   * @param email O email do usuário
   * @param password A senha do usuário
   * @returns O token de autenticação do usuário ou erro
   */
  public getJwtByCredentials(email: string, password: string): Observable<IColetaBackendResponse<string>> {
    return this.rawRequest('POST', '/auth/login', { email, password });
  }

  /**
   * Busca os dados do usuário logado
   * @returns Os dados do usuário ou erro
   */
  public getCurrentUserData(): Observable<IColetaBackendResponse<IColetaUser>> {
    return this.rawRequest('GET', '/user/me');
  }
}

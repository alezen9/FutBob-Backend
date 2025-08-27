import axios, { AxiosInstance } from 'axios'
import { get } from 'lodash'

class ZenAxios {
   create (_host?: string): AxiosInstance {
      const _self: AxiosInstance = axios.create({
         baseURL: _host || process.env.NODE_ENV === 'production' 
            ? process.env.BASE_API_URL 
            : 'http://localhost:7001',
         timeout: 100000,
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            common: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            }
         }
      })
      this.setResponseInterceptor(_self)
      return _self
   }

   private setResponseInterceptor(_self: AxiosInstance): void {
      _self.interceptors.response.use(
         response => response.data || null,
         error => {
         throw get(error, 'response.data.errors[0].message', error)
         }
      )
   }
}

export const zenAxiosInstance = new ZenAxios()
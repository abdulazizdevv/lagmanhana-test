import axios from 'axios'

export const yandexService = {
  getPlaces: (params: any, region = '71.392727, 42.899664', apikey: string) =>
    axios.get('https://search-maps.yandex.ru/v1/', {
      params: {
        ...params,
        type: 'biz',
        lang: 'ru_RU',
        apikey: apikey,
        results: 5,
        ll: region,
        spn: '6.5,6.5',
        rspn: 1,
      },
    }),
  getGeocode: (params: any, apikey: string) =>
    axios.get('https://geocode-maps.yandex.ru/1.x/', {
      params: {
        format: 'json',
        apikey: apikey,
        geocode: params.geocode,
        sco: 'latlong',
        lang: 'ru-RU',
        results: 5,
        ll: params.ll,
        spn: '6.5,6.5',
        rspn: 1,
        uri: params.uri,
      },
    }),
  getSuggest: (params: any, region = '71.392727, 42.899664', apikey: string) =>
    axios.get('https://suggest-maps.yandex.ru/v1/suggest', {
      params: {
        text: params.text,
        lang: 'ru',
        results: '10',
        // highlight: '',
        ll: region,
        spn: '6.5,6.5',
        ull: params.ull,
        types: 'geo,biz',
        apikey: apikey,
        attrs: 'uri',
      },
    }),
}

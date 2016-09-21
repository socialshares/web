import 'babel-es6-polyfill'
import domready from 'domready'
import queryString from 'query-string'
import * as services from './services';
import './share-icons';
import '../share.ejs'
import '../css/share.css'

const params = Object.assign({
  url: '',
  text: '',
  via: '',
  title: '',
  'hide-services': '',
}, queryString.parse(location.search))

params.hiddenServices = params['hide-services'].split(',')

const items = []

Object.keys(services).forEach((service, key) => {
  const url = services[service].makeUrl(params)

  if (params.hiddenServices.indexOf(service) === -1) {
    items.push(`
      <li class="services-${service}">
        <a href="${url}">
          <svg class="icon"><use xlink:href="#icon-${service}"></use></svg>
        </a>
      </li>
    `)
  }
})

domready(() => {
  document.getElementById('root').innerHTML = `
    <ul class="services">${items.join('')}</ul>
  `
})

import 'babel-es6-polyfill'
import socialshares from 'socialshares'
import domready from 'domready'
import FontFaceObserver from 'fontfaceobserver'
import smoothScroll from 'smooth-scroll'
import Frtabs from 'fr-tabs'
import './icons'
import '../index.ejs'
import '../css/index.css'

const font = new FontFaceObserver('Catamaran')

font.load().then(() => {
  document.documentElement.className += 'fonts-loaded';
})

domready(() => {
  smoothScroll.init()

  Frtabs()
})

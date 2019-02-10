import moment from 'moment'
import { chain, forEach, join, reverse, uniq } from 'lodash'

export function generateUrl (url, key, params) {
  if (url.indexOf('?') > -1) {
    url = `${url}&${key}=${params}`
  } else {
    url = `${url}?${key}=${params}`
  }
  return url
}

export function formatNumber (number, places, thousand, decimal) {
  number = number || 0
  places = !isNaN(places = Math.abs(places)) ? places : 2
  thousand = thousand || ','
  decimal = decimal || '.'
  let negative = number < 0 ? '-' : ''
  let i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + ''
  let j = i.length > 3 ? i.length % 3 : 0
  return negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '')
}

export function removeComma (number) {
  return number.replace(/,/g, '')
}

export function removeDot (number) {
  return number.replace(/./g, '')
}

export function removeString (str) {
  return str.replace(/\D/g, '')
}

export function formatDate (value, formatStr = 'YYYY-MM-DD') {
  if (value) {
    return moment(value).format(formatStr)
  }
  return ''
}

export function formatUnixTime (value, formatStr = 'YYYY-MM-DD HH:mm') {
  if (value) {
    return moment.unix(value).format(formatStr)
  }
  return ''
}

export function browserNotify (options = { body: null, image: null, url: null }, title = 'Goship thông báo', icon = '/static/logo-notify.png', timeout = 10000) {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification')
  } else if (Notification.permission === 'granted') {
    gerenateNotify(options, title, icon, timeout)
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') {
        gerenateNotify(options, title, icon, timeout)
      }
    })
  }
}

function gerenateNotify (options, title, icon, timeout) {
  options.icon = icon
  let notification = new Notification(title, options)
  if (timeout) {
    setTimeout(function () {
      notification.close()
    }, timeout)
  }
  if (options.url) {
    notification.onclick = function (event) {
      notification.close()
      event.preventDefault()
      window.open(options.url)
    }
  }
}

export function mobilecheck () {
  if (navigator.userAgent.match(/Android/i) ||
   navigator.userAgent.match(/webOS/i) ||
   navigator.userAgent.match(/iPhone/i) ||
   navigator.userAgent.match(/iPad/i) ||
   navigator.userAgent.match(/iPod/i) ||
   navigator.userAgent.match(/BlackBerry/i) ||
   navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true
  } else {
    return false
  }
}

export function flattenAttributes (attrs, name = '') {
  let flattenDeep = (attrs) => {
    return chain(attrs)
      .map(function (value) {
        var r = []
        value.value.forEach(function (v) {
          // them thuoc tinh va ten
          let attrs = []
          attrs.push({ name: value.name, value: v })
          r.push({ [value.name]: v, name: name + '-' + v, attrs: attrs })
        })
        return r
      })
      .value()
  }

  let mergeArrray = (first, second) => {
    let r = []
    forEach(first, function (f) {
      forEach(second, function (s) {
        let attrs = []
        delete f.name
        delete s.name
        delete f.attrs
        delete s.attrs
        let n = ''
        let objVal = []
        let obj = Object.assign({}, s, f)
        objVal = Object.values(obj)
        n = name + '-' + join(reverse(objVal), '/')
        forEach(obj, (val, key) => {
          attrs.push({ name: key, value: val })
        })
        r.push(Object.assign({}, s, f, { name: n, attrs: attrs }))
      })
    })
    return r
  }

  let loopForEnd = (attrs) => {
    while (attrs.length > 1) {
      let first = attrs.splice(0, 1)[0]
      let next = attrs.splice(0, 1)[0]
      if (!!first && !!next) {
        attrs.push(mergeArrray(first, next))
      }
    }
    return attrs[0]
  }

  return loopForEnd(flattenDeep(attrs))
}

export function getAttributesFromItems (data) {
  return reverse(chain(data)
    .map('attributes.data')
    .flatMap()
    .reduce(function (result, value, key) {
      (result[value.name] || (result[value.name] = [])).push(value.value)
      return result
    }, {})
    .map(function (value, key) {
      return { name: key, value: uniq(value) }
    })
    .value())
}

export function vnFilter (str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  return str
}

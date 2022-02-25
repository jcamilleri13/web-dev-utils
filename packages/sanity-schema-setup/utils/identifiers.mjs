import pluralize from 'pluralize'

export function schemaName(name, prefix) {
  if (prefix) return `${prefix}${safeChars(pascalCase(name))}`
  return safeChars(camelCase(pluralize.singular(name)))
}

export function deskTitle(name, pluralise = false) {
  return titleCase(pluralise ? pluralize.plural(name) : name)
}

export function id(name) {
  return safeChars(kebabCase(name))
}

function titleCase(text) {
  return text
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function pascalCase(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join('')
}

function camelCase(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map((word, i) => {
      if (i === 0) return word
      return word[0].toUpperCase() + word.slice(1)
    })
    .join('')
}

function kebabCase(text) {
  return text.toLowerCase().split(' ').join('-').replace(/\-\-+/g, '-')
}

function safeChars(text) {
  const from =
    'ÃÀÁÄÂÇĊẼÈÉËÊĠĦÌÍÏÎÕÒÓÖÔÙÚÜÛÑŻãàáäâçċẽèéëêġħìíïîõòóöôùúüûñż·/_,:;'
  const to = 'AAAAACCEEEEEGHIIIIOOOOOUUUUNZaaaaacceeeeeghiiiiooooouuuunz------'

  return text
    .split('')
    .map((letter) => {
      const index = from.indexOf(letter)
      return index > -1 ? to[index] : letter
    })
    .join('')
    .replace(/&/g, 'and') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

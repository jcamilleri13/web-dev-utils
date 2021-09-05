const fs = require('fs')

try {
  const indexFile = fs.readFileSync('./dist/index.html', 'utf8')
  const correctedIndexFile = indexFile.replace(
    '<link rel="icon" href="/static/favicon.ico"/>',
    '<link rel="icon" href="/static/favicon.png"/>'
  )

  fs.writeFileSync('./dist/index.html', correctedIndexFile)
} catch (err) {
  console.error(err)
}

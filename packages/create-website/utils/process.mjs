import * as childProcess from 'child_process'

export async function exec(command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }

      resolve({ stdout, stderr })
    })
  })
}

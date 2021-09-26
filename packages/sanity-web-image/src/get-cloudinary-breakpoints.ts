import { v2 as cloudinary } from 'cloudinary'

const MIN_WIDTH = 300
const BYTE_STEP = 20000

export async function getCloudinaryBreakpoints (url: string, width: number): Promise<number[]> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(url, {
      responsive_breakpoints: [{
        create_derived: false,
        bytes_step: BYTE_STEP,
        min_width: MIN_WIDTH,
        max_width: width
      }]
    }, (error, result) => {
      if (error) reject(error.message)

      const breakpoints = result?.responsive_breakpoints[0].breakpoints
      const widths = breakpoints.map(({ width }: { width: number }) => width)

      resolve(widths)
    })
  })
}

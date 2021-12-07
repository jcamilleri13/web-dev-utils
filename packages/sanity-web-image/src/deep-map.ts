export async function asyncDeepMap(
  input: any,
  fn: (input: any) => Promise<undefined | any>
): Promise<any> {
  const result = await fn(input)
  if (result !== undefined) return result

  if (Array.isArray(input)) {
    return await Promise.all(input.map((item) => asyncDeepMap(item, fn)))
  }

  if (typeof input === 'object') {
    return (
      await Promise.all(
        Object.entries(input).map(async ([key, value]) => ({
          [key]: await asyncDeepMap(value, fn)
        }))
      )
    ).reduce((combinedObject, object) => ({ ...combinedObject, ...object }), {})
  }

  return input
}

export function deepMap(input: any, fn: (input: any) => undefined | any): any {
  const result = fn(input)
  if (result !== undefined) return result

  if (Array.isArray(input)) {
    return input.map((item) => deepMap(item, fn))
  }

  if (typeof input === 'object') {
    return Object.entries(input)
      .map(([key, value]) => ({ [key]: deepMap(value, fn) }))
      .reduce((combinedObject, object) => ({ ...combinedObject, ...object }), {})
  }

  return input
}

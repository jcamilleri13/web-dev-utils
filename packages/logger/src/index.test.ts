import { afterEach, assert, describe, expect, test, vi } from 'vitest'

import { LOG_LEVEL, Logger } from '.'

function callLogs(log: Logger) {
  log.debug('debug')
  log.info('info')
  log.warn('warn')
  log.error('error')
  log.success('success')
}

describe('Logger', () => {
  test('Logs to the console immediately', () => {
    const debugSpy = vi.spyOn(console, 'debug')
    const infoSpy = vi.spyOn(console, 'info')
    const warnSpy = vi.spyOn(console, 'warn')
    const errorSpy = vi.spyOn(console, 'error')
    const logSpy = vi.spyOn(console, 'log')

    const log = new Logger()
    callLogs(log)

    expect(debugSpy).toHaveBeenCalledWith('⚫ ', 'debug')
    expect(infoSpy).toHaveBeenCalledWith('🔵 ', 'info')
    expect(warnSpy).toHaveBeenCalledWith('🟡 ', 'warn')
    expect(errorSpy).toHaveBeenCalledWith('🔴 ', 'error')
    expect(logSpy).toHaveBeenCalledWith('🟢 ', 'success')

    vi.restoreAllMocks()
  })

  test("Flushes logs to the logger's plugins", async () => {
    const push = vi.fn()
    const log = new Logger([{ push }])
    log.setHeader('test header')
    callLogs(log)

    await log.flush()

    expect(push).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith('test header', [
      '🟡  warn',
      '🔴  error',
      '🟢  success',
    ])
  })

  test("Flushes verbose logs to the logger's plugins", async () => {
    const push = vi.fn()
    const log = new Logger([{ push }])
    log.setHeader('test header')
    callLogs(log)

    await log.flushAll()

    expect(push).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith('test header', [
      '⚫  debug',
      '🔵  info',
      '🟡  warn',
      '🔴  error',
      '🟢  success',
    ])
  })

  test("Flushes logs to the logger's plugins according to the set log level", async () => {
    const push = vi.fn()
    const log = new Logger([{ push }])
    log.setHeader('test header')
    log.setLogLevel(LOG_LEVEL.ERROR)
    callLogs(log)

    await log.flush()

    expect(push).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith('test header', ['🔴  error'])
  })

  test("will only flush logs to the logger's plugins if the minimum threshold is hit", async () => {
    const push = vi.fn()
    const log = new Logger([{ push, level: LOG_LEVEL.ERROR }])
    log.setHeader('test header')
    log.setLogLevel(LOG_LEVEL.DEBUG)
    log.debug('debug')

    await log.flush()

    expect(push).not.toHaveBeenCalled()
  })
})

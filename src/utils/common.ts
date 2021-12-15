import { createWriteStream } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { FileStream } from '../../typings/app'
import * as awaitStream from 'await-stream-ready'
import * as sendToWormHole from 'stream-wormhole'
import path = require('path')

export const generaFileId = (): string => {
  return uuidv4()
}

const FILE_DIR = 'template'
export const writeFileToDisk = async (
  filename: string,
  file: FileStream
): Promise<{ type: boolean; fileDir?: string; error?: any }> => {
  const fileDir = path.join(FILE_DIR, filename)
  const writeStream = createWriteStream(fileDir)
  try {
    await awaitStream.write(file.pipe(writeStream))
    return {
      type: true,
      fileDir,
    }
  } catch (e) {
    await sendToWormHole(file)
    return {
      type: false,
      error: e,
    }
  }
}

import { readFileSync } from 'fs'
import CloudmersiveConvertApiClient from 'cloudmersive-convert-api-client'

const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance
const Apikey = defaultClient.authentications['Apikey']
Apikey.apiKey = '4379d196-af2d-4b47-8b9e-57b199d209d9'

const apiInstance = new CloudmersiveConvertApiClient.MergeDocumentApi()

// const inputFile1 = readFileSync(
//   'template/0cf28c96-3577-4dcd-ae9f-7f2c4976a926.docx'
// ) // File | First input file to perform the operation on.
// const inputFile2 = readFileSync(
//   'template/ab0b8f02-bb67-459d-abc3-12430bbc2ffe.docx'
// ) // File | Second input file to perform the operation on (more than 2 can be supplied).

export function mergeDocumentDocx(docx1: string, docx2: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const callback = function (error, data, response) {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    }
    apiInstance.mergeDocumentDocx(
      readFileSync(docx1),
      readFileSync(docx2),
      callback
    )
  })
}

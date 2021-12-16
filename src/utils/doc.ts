import Docxtemplater from 'docxtemplater'
import InspectModule from 'docxtemplater/js/inspect-module'
import PizZip = require('pizzip')

// import PizZipUtils from 'pizzip/utils'

export function getDocxTags(doc: Docxtemplater) {
  const iModule = new InspectModule()
  doc.attachModule(iModule)
  doc.render()
  const tags = iModule.getAllTags()
  console.log(tags)
  return tags
}

export function loadDocxFile(data): Docxtemplater {
  const zip = new PizZip(data) // 将内容转化PizZip对象

  const doc = new Docxtemplater().loadZip(zip)
  return doc
}

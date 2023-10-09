
/**
 * Generate default barcodes depending on the device type
 * @param {object} settings - the device settings
 * @returns {Array} - an array of barcodes
 * */
export default function setControls(testprocedure, barcodes, wellCount) {

  console.log('lol')

  let newBarcodes = barcodes.map( (barcode) => {

    let controlSample = false;
    
    if(wellCount == 16) {
      controlSample = testprocedure.controlSamples.find((controlSample => {
        controlSample.position16 == barcode.posName
      }))
    } 

    if(wellCount == 96) {
      controlSample = testprocedure.controlSamples.find((controlSample => {
        controlSample.position96 == barcode.posName
      }))
    } 

    if (controlSample) {
      return ({
        ...barcode,
        blocked: true,
        label: controlSample.label,
        value: controlSample.label,
        valid: true
      })
    } else {
      return barcode
    }
  })

  return newBarcodes
}

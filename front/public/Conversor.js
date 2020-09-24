import { PDFNet } from './webviewer/lib/core/pdf/PDFNet.js';

((exports) => {
  // @link PDFNet: https://www.pdftron.com/api/web/PDFNet.html
  // @link PDFNet.PDFDoc: https://www.pdftron.com/api/web/PDFNet.PDFDoc.html

  /* exports.convertOfficeToPDF = (inputUrl, outputName, l) =>
    CoreControls.office2PDFBuffer(inputUrl, { l }).then((buffer) => {
      saveBufferAsPDFDoc(buffer, outputName);
      console.log('Finished downloading ' + outputName);
    }); */

  exports.convertOfficeToPDF = async (inputUrl, outputName) => {
    PDFNet.initialize();
    const doc = await PDFNet.Convert.officeToPdfWithPath(
      inputUrl,
      new PDFNet.Obj('0')
    );
    await doc.save(
      '../../TestFiles/Output/' + outputName,
      PDFNet.SDFDoc.SaveOptions.e_linearized
    );
    console.log('Finished saving ' + outputName);
  };
})(window);

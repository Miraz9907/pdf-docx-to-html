import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import mammoth from "mammoth";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const PdfDocxToHtml = () => {
    const [fileContent, setFileContent] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type === "application/pdf") {
        setFileContent(file);
      } else if (file.name.endsWith(".docx")) {
        const reader = new FileReader();
        reader.onload = async () => {
          const result = await mammoth.convertToHtml({
            arrayBuffer: reader.result,
          });
          setFileContent(result.value);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handlePDFPageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };
    return (
        <div>
      <h2>DOCX and PDF Content on Web page</h2>
      <input type="file" accept=".docx, .pdf" onChange={handleFileChange} />

      {fileContent &&
        fileContent instanceof File &&
        fileContent.type === "application/pdf" && (
          <div>
            <Document
              file={fileContent}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <p>
              Page {pageNumber} of {numPages}
            </p>
            <button onClick={() => handlePDFPageChange(pageNumber - 1)}>
              Previous Page
            </button>
            <button onClick={() => handlePDFPageChange(pageNumber + 1)}>
              Next Page
            </button>
          </div>
        )}

      {fileContent && typeof fileContent === "string" && (
        <div dangerouslySetInnerHTML={{ __html: fileContent }} />
      )}
    </div>
    );
};

export default PdfDocxToHtml;
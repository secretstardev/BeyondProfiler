import React, { useState } from "react";
import Button from "../Button";
import html2pdf from "html2pdf.js";
import emailJs from "@emailjs/browser";
import toast from "react-hot-toast";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from '@ironsoftware/ironpdf';
import PDFTemplate from "../PDFTemplate";
import jsPDF from 'jspdf';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  elementId: string;
  emailId: string;
  graphElementId: string;
  result: string;
  chartElementId: any;
}

const DownloadPdf: React.FC<Props> = ({
  elementId,
  emailId,
  graphElementId,
  result,
  chartElementId,
}) => {
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleClick = async () => {
    setDownloadLoading(true);
    // html2pdf(document.getElementById("recommendations"));

    const doc = new jsPDF({
      format: 'a4',
      unit: 'px',
    });

    doc.html(document.getElementById(elementId), {
      async callback(doc) {
        await doc.save('document');
      },
    });

    // const container = document.createElement("div");

    // container.style.width = "100%";

    // const graphElement = document.getElementById(graphElementId);
    // if (graphElement) {
    //   const clonedGraphElement = graphElement.cloneNode(true) as HTMLElement;
    //   clonedGraphElement.style.padding = "20px";
    //   container.appendChild(clonedGraphElement);
    // }

    // container.appendChild(document.createElement("div")).style.pageBreakBefore =
    //   "always";

    // const contentElement = document.getElementById(elementId);
    // if (contentElement) {
    //   const clonedContentElement = contentElement.cloneNode(
    //     true
    //   ) as HTMLElement;
    //   clonedContentElement.style.padding = "30px 50px";
    //   container.appendChild(clonedContentElement);
    // }

    // html2pdf(container);

    setDownloadLoading(false);
  };

  const handleDownloadPDF = () => {
    // ReactPDF.render(<PDFTemplate />, `./example.pdf`);
    html2pdf(<PDFTemplate />);
  }

  const handleSendEmail = () => {
    console.log(emailId);
    setLoading(true);
    // const element = document.getElementById(elementId);
    const myhtml = `<p>You finished the survey and please use this link to see the result: <a href='${window.location.pathname}'>${window.location.pathname}</a></p>`

    // const emailParams = {
    //   to_email: emailId,
    //   subject: "Result of Survey at ND_PROFILER",
    //   my_html: `Hello`,
    // };

    const emailParams = {
      from_name: "BeyondProfiler",
      to_name: localStorage.getItem("firstname"),
      subject: "Result of Survey at ND_PROFILER",
      result_link: "http://localhost:5173" + window.location.pathname,
    };

    emailJs
      .send(
        "service_91ggvfh",
        "template_w2r0ovy",
        emailParams,
        "P8X96UvF2VVSb5gHb"
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        toast.success("Email Sent Successfully");
      });
  };

  return (
    <div className="flex justify-center items-center gap-x-3 z-50">
      <Button
        className="bg-[#3C3C3C] text-md font-normal text-white w-[182px] h-[49px]"
        onClick={handleSendEmail}
        disabled={loading}
      >
        Send Email
      </Button>
      {/* <Button
        className="bg-[#3C3C3C] text-md font-normal text-white w-[182px] h-[49px]"
        onClick={handleClick}
        disabled={downloadLoading}
      >
        Download
      </Button> */}
      {/* <Button
        className="bg-[#3C3C3C] text-md font-normal text-white w-[182px] h-[49px]"
        onClick={handleDownloadPDF}
        disabled={downloadLoading}
      >
        Download
      </Button> */}

      <PDFDownloadLink
        document={
          <PDFTemplate result={result} chart={document.getElementById(chartElementId)} recommendation={document.getElementById(elementId)} />
        }
        fileName={"file.pdf"}
      >
        <Button
          className="bg-[#3C3C3C] text-md font-normal text-white w-[182px] h-[49px]"
          onClick={handleDownloadPDF}
          disabled={downloadLoading}
        >
          Download
        </Button>
      </PDFDownloadLink>
    </div>
  );
};

export default DownloadPdf;

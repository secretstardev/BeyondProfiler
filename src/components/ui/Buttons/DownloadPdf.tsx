import React, { useState } from "react";
import Button from "../Button";
// import html2pdf from "html2pdf.js";
import emailJs from "@emailjs/browser";
import toast from "react-hot-toast";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFTemplate from "../PDFTemplate";
import jsPDF from 'jspdf';
import ClipLoader from "react-spinners/ClipLoader";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  elementId: string;
  emailId: string;
  graphElementId: string;
  result: string;
  resultInfo: any;
  chartElementId: any;
}

const DownloadPdf: React.FC<Props> = ({
  elementId,
  emailId,
  graphElementId,
  result,
  resultInfo,
  chartElementId,
}) => {
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleDownloadPDF = () => {
    // ReactPDF.render(<PDFTemplate />, `./example.pdf`);
    // html2pdf(<PDFTemplate />);
  }

  const handleSendEmail = () => {
    console.log(emailId);
    setLoading(true);

    const emailParams = {
      from_name: "BeyondProfiler",
      to_name: localStorage.getItem("firstname"),
      child_name: localStorage.getItem("childname"),
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

  const setProgress = (b: boolean) => {
    setIsLoading(b);
  }

  return (
    <div className="flex justify-center items-center gap-x-3 z-50">
      <Button
        className="bg-[#3C3C3C] text-md font-normal text-white w-[182px] h-[49px]"
        onClick={handleSendEmail}
        disabled={loading}
      >
        Send Email
      </Button>

      <PDFDownloadLink
        document={
          <PDFTemplate result={result} resultInfo={resultInfo} chart={document.getElementById(chartElementId)} recommendation={document.getElementById(elementId)} setProgress={setProgress} />
        }
        fileName={"result.pdf"}
      >
        <Button
          className="bg-[#3C3C3C] text-md font-normal text-white w-[182px] h-[49px]"
          onClick={handleDownloadPDF}
          disabled={downloadLoading}
        >
          Download
        </Button>
      </PDFDownloadLink>
      {
        isLoading ? <div className=" fixed top-0 left-0 w-full min-h-[100vh] justify-center items-center flex bg-opacity-20 bg-gray-900 z-50">
          <ClipLoader
            color={"#3b82f6"}
            loading={true}
            // cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div> : <></>
      }
    </div>
  );
};

export default DownloadPdf;

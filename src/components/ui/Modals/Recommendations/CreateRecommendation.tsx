import React, { useEffect, useState } from "react";
import Button from "../../Button";

import { createRecommendation } from "../../../../helpers/recommendations";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { getSectionById } from "../../../../helpers/sections";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from 'firebase/storage';
import ClipLoader from "react-spinners/ClipLoader";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  surveyId: string;
  sectionId: string;
  setIsCreateOpen: (args: boolean) => void;
  section: any;
  setProcess: any;
}

const CreateRecommendation: React.FC<Props> = ({
  surveyId,
  sectionId,
  setIsCreateOpen,
  section,
  setProcess
}) => {


  const { quill, quillRef } = useQuill();
  // const { quill: quill1, quillRef: quillRef1 } = useQuill();
  // const { quill: quill2, quillRef: quillRef2 } = useQuill();
  // const { quill: quill3, quillRef: quillRef3 } = useQuill();
  // const { quill: quill4, quillRef: quillRef4 } = useQuill();

  const [option1, setOption1] = useState<string>("");
  const [option2, setOption2] = useState<string>("");
  const [option3, setOption3] = useState<string>("");
  const [option4, setOption4] = useState<string>("");
  const [sectionDetails, setSectionDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const storage = getStorage();
  // console.log("section Id", sectionId);

  useEffect(() => {
    getSectionById(section.id, setSectionDetails);
  }, [sectionId]);
  useEffect(() => {
    console.log("sectionDetails\n", sectionDetails)
    setOption1(sectionDetails?.from0to25 ?? "");
    setOption2(sectionDetails?.from25to50 ?? "");
    setOption3(sectionDetails?.from50to75 ?? "");
    setOption4(sectionDetails?.from75to100 ?? "");
  }, [sectionDetails]);

  // useEffect(() => {
  //   if (quill1) {
  //     quill1.clipboard.dangerouslyPasteHTML(option1);
  //   }
  // }, [quill1, option1])

  // useEffect(() => {
  //   if (quill2) {
  //     quill2.clipboard.dangerouslyPasteHTML(option2);
  //   }
  // }, [quill2, option2])

  // useEffect(() => {
  //   if (quill3) {
  //     quill3.clipboard.dangerouslyPasteHTML(option3);
  //   }
  // }, [quill3, option3])

  // useEffect(() => {
  //   if (quill4) {
  //     quill4.clipboard.dangerouslyPasteHTML(option4);
  //   }
  // }, [quill4, option4])

  const extractImgSrcs = (htmlText: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    // Select all <img> elements
    const imgElements = doc.querySelectorAll('img');

    // Extract the src attributes
    const srcs: string[] = [];
    imgElements.forEach((img) => {
      const src = img.getAttribute('src');
      if (src) {
        srcs.push(src);
      }
    });

    return srcs;
  }

  const base64ToBlob = (dataUrl: string): Blob => {
    const [metadata, base64String] = dataUrl.split(',');
    if (!metadata || !base64String) {
      throw new Error('Invalid data URL');
    }
    const mimeType = metadata.match(/:(.*?);/)?.[1] || '';
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from({ length: byteCharacters.length }, (_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  const handleUpload = (dataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const blob = base64ToBlob(dataUrl);
      const storageRef = ref(storage, `images/${Date.now()}.png`);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Error uploading image to Firebase storage:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const replaceSubstring = (str: string, startIndex: number, length: number, replacement: string): string => {
    // Ensure the start index and length are valid
    if (startIndex < 0 || startIndex >= str.length || length < 0) {
      throw new Error("Invalid start index or length");
    }

    // Calculate the end index of the substring to be replaced
    const endIndex = startIndex + length;

    // Ensure end index does not exceed the string length
    if (endIndex > str.length) {
      throw new Error("Invalid length, exceeds string bounds");
    }

    // Slice the string into three parts: before, the substring to be replaced, and after
    const before = str.slice(0, startIndex);
    const after = str.slice(endIndex);

    // Concatenate the parts with the replacement string
    return before + replacement + after;
  }

  const handelClick = async () => {

    /*
    setProcess(true);
    let newHTMLText1 = "";
    let newHTMLText2 = "";
    let newHTMLText3 = "";
    let newHTMLText4 = "";
    if (quill1) {
      const imgSources = extractImgSrcs(quill1.root.innerHTML);
      newHTMLText1 = quill1.root.innerHTML.toString();
      for (let i = 0; i < imgSources.length; i++) {
        let src = imgSources[i];
        if (src?.startsWith("data:image")) {
          const downloadURL = await handleUpload(src);
          const result = replaceSubstring(newHTMLText1, newHTMLText1.indexOf(src), src.length, downloadURL);
          newHTMLText1 = result;
        }
      }
      quill1.clipboard.dangerouslyPasteHTML(newHTMLText1);
    }

    if (quill2) {
      const imgSources = extractImgSrcs(quill2.root.innerHTML);
      newHTMLText2 = quill2.root.innerHTML.toString();
      for (let i = 0; i < imgSources.length; i++) {
        let src = imgSources[i];
        if (src?.startsWith("data:image")) {
          const downloadURL = await handleUpload(src);
          const result = replaceSubstring(newHTMLText2, newHTMLText2.indexOf(src), src.length, downloadURL);
          newHTMLText2 = result;
        }
      }
      quill2.clipboard.dangerouslyPasteHTML(newHTMLText2);
    }

    if (quill3) {
      const imgSources = extractImgSrcs(quill3.root.innerHTML);
      newHTMLText3 = quill3.root.innerHTML.toString();
      for (let i = 0; i < imgSources.length; i++) {
        let src = imgSources[i];
        if (src?.startsWith("data:image")) {
          const downloadURL = await handleUpload(src);
          const result = replaceSubstring(newHTMLText3, newHTMLText3.indexOf(src), src.length, downloadURL);
          newHTMLText3 = result;
        }
      }
      quill3.clipboard.dangerouslyPasteHTML(newHTMLText3);
    }

    if (quill4) {
      const imgSources = extractImgSrcs(quill4.root.innerHTML);
      newHTMLText4 = quill4.root.innerHTML.toString();
      for (let i = 0; i < imgSources.length; i++) {
        let src = imgSources[i];
        if (src?.startsWith("data:image")) {
          const downloadURL = await handleUpload(src);
          const result = replaceSubstring(newHTMLText4, newHTMLText4.indexOf(src), src.length, downloadURL);
          newHTMLText4 = result;
        }
      }
      quill4.clipboard.dangerouslyPasteHTML(newHTMLText4);
    }

    const recommendationData = {
      from0to25: newHTMLText1,
      from25to50: newHTMLText2,
      from50to75: newHTMLText3,
      from75to100: newHTMLText4,
    };

    if (!newHTMLText1 && !newHTMLText2 && !newHTMLText3 && !newHTMLText4) {
      return toast.error("text field cannot be empty");
    } else {
      setIsLoading(true);
      createRecommendation(
        surveyId,
        section,
        recommendationData,
        setIsCreateOpen,
        setIsLoading
      );
    }
    setProcess(false);
    */
  };

  return (
    <div>
      <h6 className="text-lg text-primary font-semibold mt-2 mb-1">
        From 0% to 25% results
      </h6>
      <div ref={quillRef} />
      {/* 
      <h6 className="text-lg text-primary font-semibold mt-2 mb-1">
        From 26% to 50% results
      </h6>
      <div ref={quillRef2} />

      <h6 className="text-lg text-primary font-semibold mt-2 mb-1">
        From 51% to 75% results
      </h6>
      <div ref={quillRef3} />

      <h6 className="text-lg text-primary font-semibold mt-2 mb-1">
        From 76% to 100% results
      </h6>
      <div ref={quillRef4} /> */}


      <div className="flex justify-end">
        <Button className="text-md h-10" onClick={handelClick}>
          {isLoading ? (
            <svg
              aria-hidden="true"
              className="w-7 h-7 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateRecommendation;

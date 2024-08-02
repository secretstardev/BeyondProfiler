import { useState, useEffect } from "react";
import Header from "../../components/header";
import DownloadPdf from "../../components/ui/Buttons/DownloadPdf";
import Chart from "../../components/ui/Chart";
import {
  getAllResultData,
  getFilteredRecommendationsData,
  getResults,
} from "../../helpers/result";
import { RecommendationData, Survey, User } from "../../Types";
import { getSurveyById } from "../../helpers/surveys";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import PDFTemplate from "../../components/ui/PDFTemplate";

const Result = () => {
  const [results, setResults] = useState([]);
  const [survey, setSurvey] = useState<Survey>();
  const [sections, setSections] = useState<string[]>();
  const [data, setData] = useState<any>(); // eslint-disable-line
  const [user, setUser] = useState<User>();
  const [recommendations, setRecommendations] =
    useState<RecommendationData[]>();

  const pathname = window.location.pathname;
  const surveyId = pathname?.split("/")[3];
  const resultId = pathname?.split("/")[4];

  useEffect(() => {
    const uid = localStorage.getItem("uid")!;
    const fetchData = async () => {
      getSurveyById(surveyId, setSurvey);
      //   getResults(uid, surveyId, setResults);
    };
    fetchData();
    getAllResultData(uid, surveyId, setResults);
  }, [surveyId]);

  useEffect(() => {
    console.log(survey);
  }, [survey])


  useEffect(() => {
    const uid = localStorage.getItem("uid")!;
    getDoc(doc(collection(db, "users"), uid)).then((doc) => {
      if (doc.exists()) {
        setUser({ ...(doc.data() as User) });
      }
    });
  }, []);

  // useEffect(() => {
  //    const fetchData = async () => {
  //     getFilteredRecommendationsData(results!, setRecommendations, surveyId);
  //   };
  //   fetchData();
  // }, [results, surveyId]);

  useEffect(() => {
    console.log("results:", results);
    const result = results.filter((item: any) => item.resultId == resultId)[0]
    setSections(result?.recommendations?.map((val: any) => val.section));
    setData(
      result?.scoreBySection?.map((val: any) => val.score.toFixed(0))
    );
  }, [recommendations, results]);

  useEffect(() => {
    if (results) {
      const result = results.filter((item: any) => item.resultId == resultId)[0]
      setRecommendations(result?.recommendations);
    }
  }, [results]);

  return (
    <div>
      <Header heading={`Results: ${survey?.title == undefined ? '' : survey?.title}`} />
      <div
        className="w-full flex flex-col gap-y-24 justify-between text-[#3C3C3C] mt-16 mb-20"
        id="result"
      >
        <div className="" id="graphElement">
          <h2 className="text-3xl font-normal ps-7">
            Results & Recommendations
          </h2>
          <p className="text-sm mt-2 mb-14 ps-7">{survey?.description}</p>
          <div id="ChartElement" className="me-28 w-full flex flex-row justify-center">
            <Chart sections={sections!} data={data} />
          </div>
        </div>
        <div id="recommendations">
          {recommendations &&
            recommendations?.map((val, index) => {
              return (
                <div
                  key={index}
                  className="relative z-0  bg-cover bg-end mt-5 rounded-md font-medium flex flex-col justify-between items-start overflow-hidden"
                // className="relative z-0 bg-[url('https://img.freepik.com/free-vector/dynamic-gradient-grainy-background_23-2148963687.jpg')] bg-cover bg-end mt-5 rounded-md text-white font-medium flex flex-col justify-between items-start overflow-hidden"
                >
                  <div className="absolute z-10 h-full w-full"></div>
                  <h2 className="text-2xl bg-blue-800 w-full text-white font-normal p-5 mb-2 uppercase rounded-md">
                    {val?.section}
                  </h2>
                  <div className=" text-black-800">
                    {val?.recommendation !== null && (
                      <div
                        className="ms-2 font-normal"
                        dangerouslySetInnerHTML={{
                          __html: val?.recommendation,
                        }}
                      />
                    )}
                  </div>
                  {/* <div className="relative bg-blue-600/50 h-full w-full z-20 flex-col flex justify-between items-start p-5 ">
                    <h2 className="text-2xl w-full font-normal  mb-2 uppercase">
                      {val?.section}
                    </h2>
                    <div className="h-[2px] w-full bg-[#FFFFFF] rounded-full mb-3" />
                    {val?.recommendation !== null && (
                      <div
                        className="ms-2 font-normal"
                        dangerouslySetInnerHTML={{
                          __html: val?.recommendation,
                        }}
                      />
                    )}
                  </div> */}
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex gap-7 mb-20 ps-7">
        <DownloadPdf
          elementId="recommendations"
          graphElementId="graphElement"
          chartElementId="ChartElement"
          result={survey?.description}
          resultInfo={results.filter((item: any) => item.resultId == resultId)[0]}
          emailId={user?.email || ""}
        />
        {/* <SendMail elementId="result" /> */}
      </div>
    </div>
  );
};

export default Result;

// <div
//   className="mb-7 p-5 rounded-md shadow-lg bg-gradient-to-r from-[#00c6ff]  to-[#0072ff] text-white w-full max-w-[250px]"
//   key={index}
// >
//   <h2 className="text-2xl font-medium  mb-1 uppercase">
//     {val?.sectionTitle}
//   </h2>
//   <div className="h-[2px] w-full bg-slate-500/10 rounded-full mb-3" />
//   {val?.recommendation !== null && (
//     <div
//       className="ms-2"
//       dangerouslySetInnerHTML={{ __html: val?.recommendation }}
//     />
//   )}
// </div>

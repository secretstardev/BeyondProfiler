import React, { useEffect, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { addResponse } from "../../../helpers/result";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Database } from "../../../Types/supabase";
import { atom, useRecoilState } from "recoil";
import { surveyState } from "../../../recoil/recoil";
import { resultState } from "../../../recoil/recoil";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/firebase";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  questions: Database["public"]["Tables"]["questions"]["Row"][] | undefined;
}

interface SubSection {
  id: any;

  // other properties...
}

interface Section {
  subsections?: SubSection[];
  id: string;
  title: any;
  from75to100: any;
  from50to75: any;
  from25to50: any;
  from0to25: any;
  // other properties...
}

interface Survey {
  sections?: Section[];
  // other properties...
}

const QuestionForm: React.FC<Props> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] =
    useState<Database["public"]["Tables"]["questions"]["Row"]>();
  const [allQuestions, setAllQuestions] = useState<
    Database["public"]["Tables"]["questions"]["Row"][]
  >([]);
  const [answer, setAnswer] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState<string>("");
  const [color, setColor] = useState("");
  const surveyState = atom<Survey | undefined>({
    key: 'surveyState',
    default: undefined,
  });
  const [survey, setSurvey] = useRecoilState<Survey | undefined>(surveyState);
  const [results, setResults] = useRecoilState(resultState);
  const [points, setPoints] = useState<number>(0);
  const [tempResult, setTempResult] = useState<
    Array<{
      sectionId: string;
      subsectionId: string;
      questionId: string;
      sectionname: string;
      points: number;
      sectionRecOne: string;
      sectionRecTwo: string;
      sectionRecThree: string;
      sectionRecFour: string;
    }>
  >([]);
  const [resultId, setResultId] = useState("");

  const pathname = window.location.pathname;
  const navigate = useNavigate();
  const surveyId = pathname.split("/")[3];
  const userId = localStorage.getItem("uid");

  useEffect(() => {
    if (questions) {
      setCurrentQuestion(allQuestions[index]);
    }
    // console.log("questions", getQuestionsFromSurvey());
    setAllQuestions(getQuestionsFromSurvey());
  }, [questions, index, surveyId]);

  useEffect(() => {
  }, [tempResult])


  const handleNext = (e: any) => {
    e.preventDefault();

    if (!answer) {
      return toast.error("Select any option");
    } else {
      setColor("n");
      setAnswer("");
    }

    const nextIndex = index + 1;

    if (allQuestions.length - 1 !== index) {
      setProgress(100 * nextIndex / allQuestions.length)
      setIndex(nextIndex);
      setCurrentQuestion(allQuestions[nextIndex]);
      if (tempResult.filter((item: any) => item.questionId == allQuestions[nextIndex]?.id).length != 0) {
        let pt: any = tempResult.filter((item: any) => item.questionId == allQuestions[nextIndex]?.id)[0]?.points;
        if (pt == 1) {
          setColor("a");
          document.getElementById("radio1")?.click();
        }
        if (pt == 0.7) {
          setColor("b");
          document.getElementById("radio2")?.click();
        }
        if (pt == 0.4) {
          setColor("c");
          document.getElementById("radio3")?.click();
        }
        if (pt == 0.1) {
          setColor("d");
          document.getElementById("radio4")?.click();
        }
      }
    } else {
      setIsOpen(true);
      setProgress(100);
    }

    const subsectionId = currentQuestion?.subsectionid;

    const sectionId = survey?.sections?.find((i: any) =>
      i.subsections?.find((j: any) => j.id === subsectionId)
    )?.id;
    const sectionname = survey?.sections?.find((i: any) =>
      i.subsections?.find((j: any) => j.id === subsectionId)
    )?.title;
    const sectionRecOne = survey?.sections?.find((i: any) =>
      i.subsections?.find((j: any) => j.id === subsectionId)
    )?.from75to100;
    const sectionRecTwo = survey?.sections?.find((i: any) =>
      i.subsections?.find((j: any) => j.id === subsectionId)
    )?.from50to75;
    const sectionRecThree = survey?.sections?.find((i: any) =>
      i.subsections?.find((j: any) => j.id === subsectionId)
    )?.from25to50;
    const sectionRecFour = survey?.sections?.find((i: any) =>
      i.subsections?.find((j: any) => j.id === subsectionId)
    )?.from0to25;
    const questionId = currentQuestion?.id;
    const questionWeight = currentQuestion?.weight;

    if (tempResult.filter((item: any) => item.questionId == questionId).length == 0) {
      setTempResult((prev) => [
        ...prev,
        {
          points,
          questionId,
          sectionId,
          sectionname,
          subsectionId,
          sectionRecOne,
          sectionRecTwo,
          sectionRecThree,
          sectionRecFour,
          questionWeight
        } as any,
      ]);
    }
    else {
      let newArray: any = tempResult.map((item: any) => {
        if (item.questionId == questionId) {
          return {
            points,
            questionId,
            sectionId,
            sectionname,
            subsectionId,
            sectionRecOne,
            sectionRecTwo,
            sectionRecThree,
            sectionRecFour,
            questionWeight
          };
        }
        else {
          return item;
        }
      });
      setTempResult(newArray);
    }
  };

  const handlePrevious = (e: any) => {
    e.preventDefault();

    const nextIndex = index - 1;

    if (nextIndex >= 0) {
      setIndex(nextIndex);
      setCurrentQuestion(allQuestions[nextIndex]);
      setProgress(100 * nextIndex / allQuestions.length)

      if (tempResult.filter((item: any) => item.questionId == allQuestions[nextIndex]?.id).length != 0) {
        let pt: any = tempResult.filter((item: any) => item.questionId == allQuestions[nextIndex]?.id)[0]?.points;
        if (pt == 1) {
          setColor("a");
          document.getElementById("radio1")?.click();
        }
        if (pt == 0.7) {
          setColor("b");
          document.getElementById("radio2")?.click();
        }
        if (pt == 0.4) {
          setColor("c");
          document.getElementById("radio3")?.click();
        }
        if (pt == 0.1) {
          setColor("d");
          document.getElementById("radio4")?.click();
        }
      }

    } else {
      return;
    }

  };

  useEffect(() => {
    if (isOpen) {
      const uniqueResults = tempResult.reduce((acc: any, current: any) => {
        // Check if there is an existing result with the same sectionId
        const existingResultIndex = acc.findIndex(
          (item: any) => item.sectionId === current.sectionId
        );

        if (existingResultIndex === -1) {
          // If not found, add a new entry
          acc.push({
            sectionId: current.sectionId,
            sectionname: current.sectionname,
            sectionRecOne: current.sectionRecOne,
            sectionRecTwo: current.sectionRecTwo,
            sectionRecThree: current.sectionRecThree,
            sectionRecFour: current.sectionRecFour,
            subsections: [
              {
                subsectionId: current.subsectionId,
                responses: [
                  {
                    questionId: current.questionId,
                    points: current.points,
                    questionWeight: current.questionWeight,
                  },
                ],
              },
            ],
          });
        } else {
          // If found, check if there is an existing subsectionId
          const existingSubsectionIndex = acc[
            existingResultIndex
          ].subsections.findIndex(
            (item: any) => item.subsectionId === current.subsectionId
          );

          if (existingSubsectionIndex === -1) {
            // If not found, add a new subsection entry
            acc[existingResultIndex].subsections.push({
              subsectionId: current.subsectionId,
              responses: [
                {
                  questionId: current.questionId,
                  points: current.points,
                  questionWeight: current.questionWeight,
                },
              ],
            });
          } else {
            // If found, add the response to the existing subsection entry
            acc[existingResultIndex].subsections[
              existingSubsectionIndex
            ].responses.push({
              questionId: current.questionId,
              points: current.points,
              questionWeight: current.questionWeight,
            });
          }
        }

        return acc;
      }, []);


      setResults({
        surveyId,
        results: uniqueResults,
      });

      calculateResults(uniqueResults);
    }
  }, [isOpen]);

  const getCurrentFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    // getMonth() returns month from 0 (January) to 11 (December), so we add 1
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const generateIDbyDate = () => {
    const milliSecondsSinceEpoch = new Date().getTime();
    setResultId(milliSecondsSinceEpoch.toString(16));
    return milliSecondsSinceEpoch.toString(16);
  }

  const calculateResults = async (uniqueResults: any) => {
    // Initialize result object
    const resultObject = {
      resultId: generateIDbyDate(),
      surveyId: surveyId,
      childname: localStorage.getItem("childname"),
      childbirthday: localStorage.getItem("birthday"),
      completedAt: getCurrentFormattedDate(),
      scoreBySection: [] as any[],
      recommendations: [] as any[],
    };

    // Function to calculate subsection total score
    const calculateSubsectionTotal = (subsection: any) => {
      return subsection.responses.reduce((acc: any, response: any) => acc + response.points * response.questionWeight, 0);
    };

    const calculateSubsectionWeightTotal = (subsection: any) => {
      return subsection.responses.reduce((acc: any, response: any) => acc + response.questionWeight, 0);
    };



    // Iterate through results
    uniqueResults.forEach((result: any) => {
      // Calculate total score for the current section
      const sectionTotalScore = result.subsections.reduce((acc: any, subsection: any) => {
        console.log("subsection:\n", subsection, "\nscore:\n", calculateSubsectionTotal(subsection), "\nweight:\n", calculateSubsectionWeightTotal(subsection));
        return acc + calculateSubsectionTotal(subsection) / calculateSubsectionWeightTotal(subsection);
      }, 0);

      // Calculate proportionate points for the section based on the total survey points
      const proportionatePoints = (sectionTotalScore / result.subsections.length) * 100;

      // Add section and its proportionate points to the result object
      resultObject.scoreBySection.push({
        section: result.sectionname,
        score: proportionatePoints,
      });

      // Determine recommendation based on proportionate points (customize this logic)
      const recommendation =
        proportionatePoints >= 75
          ? result.sectionRecOne
          : proportionatePoints >= 50
            ? result.sectionRecTwo
            : proportionatePoints >= 25
              ? result.sectionRecThree
              : result.sectionRecFour;

      resultObject.recommendations.push({
        section: result.sectionname,
        recommendation: recommendation,
      });
    });

    try {
      if (userId) {
        await addDoc(
          collection(db, "users", userId, "completedSurveys"),
          resultObject
        );
      } else {
        // Handle null userId case here
      }
    } catch (error: any) {
      console.log("Error completedSurveys", error.message);
    }
  };

  // Example usage:
  // calculateResults(data.results, data.surveyId, "user123");


  // Example usage:
  // calculateResults(data.results, data.surveyId, "user123");

  // Example usage:
  // calculateResults(uniqueResultsArray, "survey123", "user456");

  const getQuestionsFromSurvey = () => {
    if (survey?.sections) {
      return survey.sections.reduce(
        (acc: any, section: any) =>
          acc.concat(section.subsections.flatMap((sub: any) => sub.questions)),
        []
      );
    }
    return [];
  };

  return (
    <div className="px-7">
      <div className="h-2 w-[255px] bg-gray-200 rounded-full mb-14 mt-12">
        <div
          className={`h-2 bg-primary rounded-full`}
          style={{ width: progress == 100 ? 99.99 + "%" : progress + "%" }}
        ></div>
      </div>
      {currentQuestion?.title ? (
        <h2 className="mt-14 text-3xl font-medium pe-10 text-primary">
          {currentQuestion?.title}
        </h2>
      ) : (
        <div className="bg-gray-200 max-w-[50vw] h-10 rounded animate-pulse mt-14"></div>
      )}
      <div>
        <form className="mt-12">
          <div className="my-2">
            <input
              className="hidden"
              id="radio1"
              onClick={() => {
                setAnswer(currentQuestion?.option1 || "");
                setOption("A");
                setPoints(1);
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.option1 ? (
              <label
                className={`flex flex-col p-3 max-w-[50vw] border-2 rounded-lg border-primary ${color === "a" && "bg-[#f0801037]"
                  } cursor-pointer`}
                htmlFor="radio1"
                onClick={() => setColor("a")}
              >
                <span className="text-primary text-md">
                  <span className="rounded-md bg-primary py-1 px-2  text-white ms-2 me-3">
                    A
                  </span>
                  {currentQuestion?.option1}
                </span>
              </label>
            ) : (
              <div className="bg-gray-200 max-w-[50vw] h-14 rounded animate-pulse"></div>
            )}
          </div>
          <div className="my-2">
            <input
              className="hidden"
              id="radio2"
              onClick={() => {
                setAnswer(currentQuestion?.option2 || "");
                setOption("B");
                setPoints(0.7);
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.option2 ? (
              <label
                className={`flex flex-col p-3 max-w-[50vw] border-2 rounded-lg border-primary ${color === "b" && "bg-[#f0801037]"
                  } cursor-pointer`}
                htmlFor="radio2"
                onClick={() => setColor("b")}
              >
                <span className="text-primary text-md">
                  <span className="rounded-md bg-primary py-1 px-2 text-white ms-2 me-3">
                    B
                  </span>
                  {currentQuestion?.option2}
                </span>
              </label>
            ) : (
              <div className="bg-gray-200 max-w-[50vw] h-14 rounded animate-pulse"></div>
            )}
          </div>
          <div className="my-2">
            <input
              className="hidden"
              id="radio3"
              onClick={() => {
                setAnswer(currentQuestion?.option3 || "");
                setOption("C");
                setPoints(0.4);
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.option3 ? (
              <label
                className={`flex flex-col p-3 max-w-[50vw] border-2 rounded-lg border-primary ${color == "c" && "bg-[#f0801037]"
                  } cursor-pointer`}
                htmlFor="radio3"
                onClick={() => setColor("c")}
              >
                <span className="text-primary text-md">
                  <span className="rounded-md bg-primary py-1 px-2 text-white ms-2 me-3">
                    C
                  </span>
                  {currentQuestion?.option3}
                </span>
              </label>
            ) : (
              <div className="bg-gray-200 max-w-[50vw] h-14 rounded animate-pulse"></div>
            )}
          </div>
          <div className="my-2">
            <input
              className="hidden"
              id="radio4"
              onClick={() => {
                setAnswer(currentQuestion?.option4 || "");
                setOption("D");
                setPoints(0.1);
              }}
              type="radio"
              name="radio"
              required
            />
            {currentQuestion?.option4 ? (
              <label
                className={`flex flex-col p-3 max-w-[50vw] border-2 rounded-lg border-primary ${color === "d" && "bg-[#f0801037]"
                  } cursor-pointer`}
                htmlFor="radio4"
                onClick={() => setColor("d")}
              >
                <span className="text-primary text-md">
                  <span className="rounded-md bg-primary py-1 px-2 text-white ms-2 me-3">
                    D
                  </span>
                  {currentQuestion?.option4}
                </span>
              </label>
            ) : (
              <div className="bg-gray-200 max-w-[50vw] h-14 rounded animate-pulse"></div>
            )}
          </div>
          <div className=" my-20 max-w-[50vw] flex flex-row justify-between">
            <Button
              className="bg-[#3C3C3C] text-lg text-white w-[182px] h-[49px]"
              onClick={handlePrevious}
              type="submit"
            >
              Previous
            </Button>
            <Button
              className="bg-[#3C3C3C] text-lg text-white w-[182px] h-[49px]"
              onClick={handleNext}
              type="submit"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
      <Modal
        isOpen={isOpen}
        title="Survey Completed"
        onChange={() => navigate(`/dashboard/user`)}
      >
        <div className="text-center flex flex-col items-center">
          <div className="flex justify-center mt-8">
            <IoMdCheckmarkCircleOutline size={70} color="#25b622" />
          </div>
          <h1 className="text-lg font-medium mt-5 mb-5">
            Congratulations! You have completed your survey.
          </h1>
          <Button
            className="bg-primary text-md text-white mb-5  h-[40px]"
            type="submit"
            onClick={() => navigate(`/dashboard/result/${surveyId}/${resultId}`)}
          >
            Show Result
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionForm;

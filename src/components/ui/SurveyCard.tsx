import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Question, Survey } from "../../Types/index";
import { getQuestionsById } from "../../helpers/questions";
import Modal from "./Modal";
import EditSurvey from "./Modals/Surveys/EditSurvey";
import { useNavigate } from "react-router-dom";
import DeleteSurvey from "./Modals/DeleteModal";
import { deleteSurvey, getCompleteSurveys } from "../../helpers/surveys";
import { Link } from "react-router-dom";
import { getResultsData } from "../../helpers/result";
import { Database } from "../../Types/supabase";
import useGetUser from "../../helpers/getUser";
import { toast } from "react-toastify";
import { BiDotsVertical, BiGroup, BiSolidGroup } from "react-icons/bi";
import { supabaseClient } from "../../config/supabase";
import { collection, getDocs, query } from "firebase/firestore";
import { loadStripe } from '@stripe/stripe-js';

const SurveyCard = ({
  survey,
  setRender,
  filter
}: {
  survey: Database["public"]["Tables"]["surveys"]["Row"];
  setRender?: (args: boolean) => void;
  filter?: string;
}) => {
  const [role, setRole] = useState("");
  const [questions, setQuestions] =
    useState<Database["public"]["Tables"]["sections"]["Row"][]>();
  const [results, setResults] = useState<any>(); // eslint-disable-line
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setIsLoading] = useState(false);
  const [numberOfQuestions, setnumberOfQuestions] = useState(0);
  const [completedSurveys, setCompletedSurvey] = useState<string[]>([]);
  const [isDropDownOpen, setIsDropDownOpen] = useState<Boolean>(survey.role == "all" ? true : false);
  const [originRole, setOriginRole] = useState<string>();
  const navigate = useNavigate();
  const { user } = useGetUser();


  const stripePromise = loadStripe('pk_test_51PF4E0AV3Qpp7LpjaToXiITrbA70UNDyQzRYJJf3GJdjtqhu5kl5w8kmwOmzV7oGaOdeWWhu4UVgFelLi0WvtGAF00syaVhRHM');

  useEffect(() => {
    setIsLoading(true);
    setRole(localStorage.getItem("role")!);
    const uid = localStorage.getItem("uid")!;
    const fetchData = async () => {
      setQuestions(await getQuestionsById(survey?.id));
      getResultsData(uid, survey?.id, setResults);
      await getCompleteSurveys(uid, setCompletedSurvey);
    };
    fetchData().finally(() => {
      setIsLoading(false);
    });
    var indicator = 0;
    //@ts-ignore
    var count = survey.sections.forEach((section) => {
      var questionCount = section.subsections.forEach((subsection: any) => {
        var question = subsection.questions.length;
        indicator = indicator + question;
      });
    });
    // console.log(indicator);
    setnumberOfQuestions(indicator);
  }, [survey?.id]);

  useEffect(() => {
    const percentage =
      (results?.length / (questions?.length ? questions?.length : 1)) * 100;
    setProgress(percentage ? percentage : 0);
  }, [results, questions]);

  const handelClick = () => {
    if (setRender) {
      deleteSurvey(survey?.id, setRender);
    }
    setIsDeleteOpen(false);
  };

  const handleShare = async (b: boolean) => {
    console.log(survey);
    console.log(filter);
    console.log(b);
    if (b) {
      const { data, error } = await supabaseClient
        .from("surveys")
        .update({ role: "all" })
        .eq('id', survey.id);
      toast.success(`This survey shared with ${filter == "child" ? "employee role" : "child role"} successfully!`);
    } else {
      const { data, error } = await supabaseClient
        .from("surveys")
        .update({ role: filter })
        .eq('id', survey.id);
      toast.success(`This survey is used for only ${filter} role now!`);
    }
  }

  const handleStart = async (amount: number) => {

    const response = await fetch(`https://us-central1-beyond-profiler.cloudfunctions.net/createCheckoutSession?amount=${amount}`);
    const { id } = await response.json();

    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({ sessionId: id });

    if (error) {
      console.error('Error redirecting to checkout:', error);
    }
  }



  return loading ? (
    <div className="relative bg-gray-300 text-white rounded-2xl w-[300px] h-[235px] p-5 mt-5 flex flex-col justify-between animate-pulse"></div>
  ) : (
    <>
      {role !== "admin" ? (
        <div className="relative z-0 bg-[url('https://img.freepik.com/free-vector/dynamic-gradient-grainy-background_23-2148963687.jpg')] bg-cover bg-end mt-5 rounded-xl w-[300px] h-[235px] text-white font-medium flex flex-col justify-between items-start overflow-hidden">
          <div className="absolute z-10 bg-blue-600/50 backdrop-blur-lg h-full w-full"></div>
          <div className="relative h-full w-full z-20 flex-col flex justify-between items-start p-5 ">
            <div>
              <Link
                to={`/dashboard/survey/${survey.id}`}
                className="text-2xl font-normal cursor-pointer uppercase line-clamp-2 min-h-[64px]"
              >
                {survey?.title}
              </Link>
              <p className="text-sm my-3 normal-case font-normal line-clamp-3 min-h-[60px]">
                {survey?.description}
              </p>
              {role == "admin" ? (
                <p className="text-sm font-normal">
                  {numberOfQuestions} questions
                </p>
              ) : role != "admin" &&
                completedSurveys &&
                completedSurveys.includes(survey?.id) ? (
                <p className="text-sm font-normal">Completed Survey</p>
              ) : (
                <p className="text-sm font-normal">
                  {numberOfQuestions} questions
                </p>
              )}

            </div>
            <div className="flex flex-row w-full justify-between mb-3">
              <div className=" justify-end ">
                {completedSurveys && completedSurveys.includes(survey?.id) ? (
                  <Button
                    className={`bg-white text-sm font-normal  p-4 whitespace-nowrap ${results?.length == numberOfQuestions
                      ? "text-blue-600"
                      : "text-blue-600"
                      } w-[104px] h-[24px]`}
                    // onClick={() => navigate(`/dashboard/result/${survey.id}`)}
                    onClick={() => navigate(`/dashboard/results/${survey.id}`)}
                  >
                    Results
                  </Button>
                ) : (
                  <Button
                    className={`bg-white text-sm p-4 whitespace-nowrap font-regular ${results?.length == numberOfQuestions
                      ? "text-blue-600"
                      : "text-blue-600"
                      } w-[104px] h-[24px]`}
                    onClick={() => handleStart(survey?.price ?? 0)}
                  >
                    Start
                  </Button>
                )}
              </div>
              <div>
                <p className=" text-[20px]">${survey?.price}</p>
              </div>
            </div>
            <Modal
              isOpen={isOpen}
              title="Edit Survey"
              onChange={() => setIsOpen(false)}
            >
              <EditSurvey
                survey={survey}
                handleClose={() => setIsOpen(false)}
                setRender={setRender}
              />
            </Modal>
            <Modal
              isOpen={isDeleteOpen}
              title="Delete Survey"
              onChange={() => setIsDeleteOpen(false)}
            >
              <DeleteSurvey
                handelClick={handelClick}
                handleClose={() => setIsDeleteOpen(false)}
              />
            </Modal>
          </div>
        </div>
      ) : (
        <div
          className={`relative z-0 bg-[url('https://img.freepik.com/free-vector/dynamic-gradient-grainy-background_23-2148963687.jpg')] bg-cover bg-end mt-5 rounded-xl w-[300px] h-[235px] text-white font-medium flex flex-col justify-between items-start overflow-hidden`}
        >
          <div className="absolute z-10 bg-blue-600/50 backdrop-blur-lg h-full w-full"></div>
          <div className="relative h-full w-full z-20 flex-col flex justify-between items-start p-5 ">
            <div>
              {role !== "admin" && (
                <div className="h-1 w-full bg-black rounded-full mb-3">
                  <div
                    className="h-1 bg-white rounded-full"
                    style={{ width: progress + "%" }}
                  ></div>
                </div>
              )}
              <Link
                to={`/dashboard/survey/${survey.id}`}
                className="text-2xl font-normal cursor-pointer uppercase  line-clamp-2  min-h-[64px]"
              >
                {survey?.title}
              </Link>
              <p className="text-sm my-3 font-normal line-clamp-3 min-h-[60px]">{survey?.description}</p>
              {role == "admin" ? (
                <p className="text-sm font-normal">
                  {numberOfQuestions} questions
                </p>
              ) : (
                <p className="text-sm font-normal">
                  Completed {results && results?.length}/
                  {questions && questions?.length} questions
                </p>
              )}
            </div>
            <div className="w-full flex justify-between mb-3">
              <div className="flex">
                <Button
                  className={`bg-white p-4 md:p-4 text-sm font-normal text-blue-600 w-[60px] h-[24px] whitespace-nowrap`}
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  className={`bg-white p-4 md:p-4 ms-3 text-sm text-blue-600 font-normal w-[60px] h-[24px] whitespace-nowrap`}
                  onClick={() => {
                    setIsDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
              <button
                onClick={() => {
                  handleShare(!isDropDownOpen);
                  setIsDropDownOpen(!isDropDownOpen);
                }}
                className="relative z-10 block p-2 text-gray-700  border border-transparent rounded-md focus:outline-none hover:bg-slate-100 hover:bg-transparent hover:text-gray-100"
              >
                {
                  !isDropDownOpen ? <BiGroup /> : <BiSolidGroup />
                }

              </button>

            </div>
          </div>
          <Modal
            isOpen={isOpen}
            title="Edit Survey"
            onChange={() => setIsOpen(false)}
          >
            <EditSurvey survey={survey} handleClose={() => setIsOpen(false)} setRender={undefined} />
          </Modal>
          <Modal
            isOpen={isDeleteOpen}
            title="Delete Survey"
            onChange={() => setIsDeleteOpen(false)}
          >
            <DeleteSurvey
              handelClick={handelClick}
              handleClose={() => setIsDeleteOpen(false)}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default SurveyCard;

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

const ResultCard = ({
  survey,
  result,
  setRender,
}: {
  survey: any;
  result: any;
  setRender?: (args: boolean) => void;
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
  const navigate = useNavigate();
  const { user } = useGetUser();


  useEffect(() => {
    const percentage =
      (results?.length / (questions?.length ? questions?.length : 1)) * 100;
    setProgress(percentage ? percentage : 0);
  }, [results, questions]);

  const handelClick = () => {
    setIsDeleteOpen(false);
  };



  return loading ? (
    <div className="relative bg-gray-300 text-white rounded-2xl w-[300px] h-[180px] p-5 mt-5 flex flex-col justify-between animate-pulse"></div>
  ) : (
    <>
      {role !== "admin" ? (
        <div className="relative z-0 bg-[url('https://img.freepik.com/free-vector/dynamic-gradient-grainy-background_23-2148963687.jpg')] bg-cover bg-end mt-5 rounded-xl w-[300px] h-[180px] text-white font-medium flex flex-col justify-between items-start overflow-hidden">
          <div className="absolute z-10 bg-blue-600/50 backdrop-blur-lg h-full w-full"></div>
          <div className="relative h-full w-full z-20 flex-col flex justify-between items-start p-5 ">
            <div>
              <Link
                to={`/dashboard/user/`}
                className="text-2xl font-normal cursor-pointer uppercase line-clamp-1 min-h-[32px]"
              >
                {result?.childname}
              </Link>
              <p className="text-sm my-3 normal-case font-normal line-clamp-1 min-h-[20px]">
                Date of birth: {result?.childbirthday}
              </p>
              <p className="text-sm font-normal">
                Completed at: {result?.completedAt}
              </p>

            </div>
            <div className="flex justify-end">
              <Button
                className={`bg-white text-sm font-normal  p-4 whitespace-nowrap ${results?.length == numberOfQuestions
                  ? "text-blue-600"
                  : "text-blue-600"
                  } w-[104px] h-[24px]`}
                // onClick={() => navigate(`/dashboard/result/${survey.id}`)}
                onClick={() => navigate(`/dashboard/result/${survey.id}/${result.resultId}`)}
              >
                Details
              </Button>
            </div>
            {/* <Modal
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
            </Modal> */}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ResultCard;



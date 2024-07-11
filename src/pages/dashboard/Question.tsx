import Header from "../../components/header";
import "../../index.css";
import { getQuestionsById } from "../../helpers/questions";
import QuestionForm from "../../components/ui/forms/QuestionForm";
import { useEffect, useState } from "react";
import { Question, Survey } from "../../Types";
import { getSurveyById } from "../../helpers/surveys";
import { Database } from "../../Types/supabase";
import { useRecoilState } from "recoil";
import { surveyState } from "../../recoil/recoil";

const QuestionPage = () => {
  const [questions, setQuestions] =
    useState<Database["public"]["Tables"]["questions"]["Row"][]>();
  const currentUrl = window.location.pathname.split("/")[3];
  const pathname = window.location.pathname;
  const surveyId = pathname?.split("/")[3];
  const [survey, setSurvey] = useRecoilState(surveyState);
  const [surveyInfo, setSurveyInfo] = useState<Survey>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getQuestionsById(currentUrl);

        // Store all questions in an array
        const allQuestions = data.reduce(
          (acc, section) =>
            acc.concat(section.subsections.flatMap((sub) => sub.questions)),
          []
        );

        setSurvey({
          surveyId: currentUrl,
          sections: data,
        });

        // Set the questions in the state
        setQuestions(allQuestions);
      } catch (error) {
        console.error("Error setting survey data:", error.message);
      }
    };

    if (currentUrl) {
      fetchData();
    }
  }, [currentUrl]);

  useEffect(() => {
    const fetchData = async () => {
      getSurveyById(surveyId, setSurveyInfo);
      //   getResults(uid, surveyId, setResults);
    };
    fetchData();
  }, [surveyId]);

  return (
    <div>
      <Header heading={surveyInfo == undefined ? "Workplace" : `Workplace ${surveyInfo?.title}`} />
      <QuestionForm questions={questions} />
    </div>
  );
};

export default QuestionPage;

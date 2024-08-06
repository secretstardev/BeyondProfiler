import React from 'react'
import { useEffect, useState } from "react";
import Header from "../../components/header";
import SurveyCard from "../../components/ui/SurveyCard";
import { Survey } from "../../Types";
import { getSurveys } from "../../helpers/surveys";
import Modal from "../../components/ui/Modal";
import CreateSurvey from "../../components/ui/Modals/Surveys/CreateSurvey";
import { Database } from "../../Types/supabase";
import { getSurveyById } from '../../helpers/surveys';
import { getAllResultData } from '../../helpers/result';
import ResultCard from '../../components/ui/ResultCard';

export default function AllResults() {
  const [surveys, setSurveys] = useState<Database["public"]["Tables"]["surveys"]["Row"][]>();
  const [filter, setFilter] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [survey, setSurvey] = useState<Survey>();
  const [results, setResults] = useState([]);

  const pathname = window.location.pathname;
  const surveyId = pathname?.split("/")[3];

  useEffect(() => {
    const uid = localStorage.getItem("uid")!;
    const fetchData = async () => {
      console.log(surveyId);
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
    console.log("results:\n", results);
  }, [results])


  useEffect(() => {
    setFilter(
      localStorage.getItem("role")! === "admin"
        ? "child"
        : localStorage.getItem("role")!
    );
  }, []);

  useEffect(() => {
    if (!filter) return;
    setLoading(true);
    const fetchData = async () => {
      await getSurveys(filter, setSurveys).finally(() => {
        setLoading(false);
      });
    };
    fetchData();
  }, [filter]);
  const isPremium = true;
  return (
    <>
      <Header heading={`Results: ${survey?.title == undefined ? '' : survey?.title}`} />
      {/* {!isPremium ? <div>Please Subsrcibed to Premium to get surveys</div> : */}

      <>
        <div className="flex justify-between mt-4">
          <p>Welcome User!</p>
        </div>
        <div className="flex gap-6">
          {!loading &&
            results?.map((result, index) => {
              return (
                <div key={index}>
                  <ResultCard survey={survey} result={result} />
                </div>
              );
            })}
        </div>
      </>
    </>
  );
}

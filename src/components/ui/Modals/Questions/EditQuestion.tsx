
import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { editQuestion } from "../../../../helpers/questions";
import { Question } from "../../../../Types";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  surveyId: string;
  sectionId: string;
  subsectionId: string;
  setIsOpen: (args: boolean) => void;
  question: any;
  setRender: (args: boolean) => void;
}

const EditQuestion: React.FC<Props> = ({
  surveyId,
  sectionId,
  subsectionId,
  setIsOpen,
  question,
  setRender
}) => {
  const [text, setText] = useState<string>(question.title);
  const [option1, setOption1] = useState<string>(question.option1);
  const [option2, setOption2] = useState<string>(question.option2);
  const [option3, setOption3] = useState<string>(question.option3);
  const [option4, setOption4] = useState<string>(question.option4);
  const [isLoading, setIsLoading] = useState(false);
  const [weight, setWeight] = useState<number>();

  const handleUpdate = () => {
    setIsLoading(true)
    const questionData = {
      text,
    };
    const optionData = {
      // id:question?.options?.id,
      option1,
      option2,
      option3,
      option4,
    };
    const weightData = {
      weight,
    };
    editQuestion(surveyId, sectionId, subsectionId, question?.id!, questionData, optionData, weightData, setIsLoading, setRender);
    setIsOpen(false);
  };

  return (
    <div>
      <h6 className="text-lg font-semibold mb-3">Text</h6>
      <Input
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4"
      />
      <h6 className="text-md text-primary font-semibold mb-4">
        Prioritize options in descending order, with Option 1 holding the
        highest priority and Option 4 with the lowest priority.
      </h6>
      <h6 className="text-lg font-semibold mb-3">Option1</h6>
      <Input
        placeholder="Enter option1"
        value={option1}
        onChange={(e) => setOption1(e.target.value)}
        className="mb-7"
      />
      <h6 className="text-lg font-semibold mb-3">Option2</h6>
      <Input
        placeholder="Enter option2"
        value={option2}
        onChange={(e) => setOption2(e.target.value)}
        className="mb-7"
      />
      <h6 className="text-lg font-semibold mb-3">Option3</h6>
      <Input
        placeholder="Enter option3"
        value={option3}
        onChange={(e) => setOption3(e.target.value)}
        className="mb-7"
      />
      <h6 className="text-lg font-semibold mb-3">Option4</h6>
      <Input
        placeholder="Enter option4"
        value={option4}
        onChange={(e) => setOption4(e.target.value)}
        className="mb-7"
      />
      <h6 className="text-lg font-semibold mb-3">Weight of Question</h6>
      <select
        id="weight"
        className="h-12 w-full mt-1 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none mb-7"
        onChange={(e) => setWeight(parseFloat(e.target.value))}
      >
        <option selected>Select Weight</option>
        <option value="0.5">Not important</option>
        <option value="1">Normal</option>
        <option value="1.5">Important</option>
      </select>
      <div className="flex justify-end">
        <Button className="text-md h-10" onClick={handleUpdate}>
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
            "Edit"
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditQuestion;

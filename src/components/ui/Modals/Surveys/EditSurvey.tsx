;
import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { Survey } from "../../../../Types";
import { updateSurvey } from "../../../../helpers/surveys";
import { Database } from "../../../../Types/supabase";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  survey: Database["public"]["Tables"]["surveys"]["Row"];
  handleClose: () => void;
  setRender: any;
}

const EditSurvey: React.FC<Props> = ({ handleClose, survey, setRender }) => {
  const [title, setTitle] = useState<Database["public"]["Tables"]["surveys"]["Row"]["title"]>(survey?.title);
  // const [tagline, setTagline] = useState<any>(survey?.tagline);
  const [description, setDescription] = useState<Database["public"]["Tables"]["surveys"]["Row"]["description"]>(survey?.description);
  const [role, setRole] = useState<Database["public"]["Tables"]["surveys"]["Row"]["role"]>(survey?.role)
  const [guide, setGuide] = useState<Database["public"]["Tables"]["surveys"]["Row"]["role"]>(survey?.guide)
  const [result25, setResult25] = useState<Database["public"]["Tables"]["surveys"]["Row"]["role"]>(survey?.result25)
  const [result50, setResult50] = useState<Database["public"]["Tables"]["surveys"]["Row"]["role"]>(survey?.result50)
  const [result75, setResult75] = useState<Database["public"]["Tables"]["surveys"]["Row"]["role"]>(survey?.result75)
  const [result100, setResult100] = useState<Database["public"]["Tables"]["surveys"]["Row"]["role"]>(survey?.result100)
  const [price, setPrice] = useState<any>(survey?.price)

  const handelClick = () => {
    const data = {
      title,
      description,
      role,
      guide,
      result25,
      result50,
      result75,
      result100,
      price
    };
    updateSurvey(survey?.id, data, setRender)
    handleClose();
  };

  return (
    <div>
      <h6 className="text-lg font-semibold mb-3">Title</h6>
      <Input
        placeholder="Enter email"
        value={title || ''}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-7"
      />
      {/* <h6 className="text-lg font-semibold mb-3">Tagline</h6>
      <Input
        placeholder="Enter tagline"
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        className="mb-7"
      /> */}
      <h6 className="text-lg font-semibold mb-3">Select Role</h6>
      <select
        id="role"
        className="h-12 w-full mt-1 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none mb-7"
        value={role || ''}
        onChange={(e) => setRole(e.target.value)}
      >
        <option>Select Role</option>
        <option value="child">Child</option>
        <option value="employee">Employee</option>
      </select>
      <h6 className="text-lg font-semibold mb-3">Description</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter description"
        value={description || ''}
        onChange={(e) => setDescription(e.target.value)}
      />
      {/* MARK:price */}
      <h6 className="text-lg font-semibold mb-3">Price(USD)</h6>
      <Input
        placeholder="Enter price"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="mb-7"
      />
      {/* MARK:guide */}
      <h6 className="text-lg font-semibold mb-3">Guide</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter guide"
        value={guide || ''}
        onChange={(e) => setGuide(e.target.value)}
      />
      {/* MARK:result */}
      <h6 className="text-lg font-semibold mb-3">Recommendation for 0%-25%</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter recommendation for 0%-25%"
        value={result25 || ''}
        onChange={(e) => setResult25(e.target.value)}
      />
      <h6 className="text-lg font-semibold mb-3">Recommendation for 25%-50%</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter recommendation for 25%-50%"
        value={result50 || ''}
        onChange={(e) => setResult50(e.target.value)}
      />
      <h6 className="text-lg font-semibold mb-3">Recommendation for 50%-75%</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter recommendation for 50%-75%"
        value={result75 || ''}
        onChange={(e) => setResult75(e.target.value)}
      />
      <h6 className="text-lg font-semibold mb-3">Recommendation for 75%-100%</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter recommendation for 75%-100%"
        value={result100 || ''}
        onChange={(e) => setResult100(e.target.value)}
      />
      <div className="flex justify-end">
        <Button className="text-md h-10" onClick={handelClick}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditSurvey;

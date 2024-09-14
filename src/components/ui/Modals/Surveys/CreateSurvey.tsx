import React, { useState } from "react";
import Input from "../../Input";
import Button from "../../Button";
import { createSurvey } from "../../../../helpers/surveys";
import { toast } from "react-toastify";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  handleClose: () => void;
  setRender: (args: boolean) => void;
}

const CreateSurvey: React.FC<Props> = ({ handleClose, setRender }) => {
  const [title, setTitle] = useState<string>();
  const [tagline, setTagline] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [role, setRole] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [guide, setGuide] = useState<string>();
  const [result25, setResult25] = useState<string>();
  const [result50, setResult50] = useState<string>();
  const [result75, setResult75] = useState<string>();
  const [result100, setResult100] = useState<string>();

  const handelClick = () => {
    const data = {
      title,
      tagline,
      description,
      role,
      price,
      guide,
      result25,
      result50,
      result75,
      result100,
      status: "pending",
    };
    if (!title) {
      return toast.error("title cannot be empty");
    } else if (!tagline) {
      return toast.error("tagline cannot be empty");
    } else if (!description) {
      return toast.error("description cannot be empty");
    } else if (!role) {
      return toast.error("role is not selected");
    } else if (!result25) {
      return toast.error("role is not selected");
    } else if (!result50) {
      return toast.error("role is not selected");
    } else if (!result75) {
      return toast.error("role is not selected");
    } else if (!result100) {
      return toast.error("role is not selected");
    } else {
      console.log("Data:\n", data);
      createSurvey(data, setRender);
      handleClose();
    }
  };

  return (
    <div className=" z-50">
      {/* MARK:title */}
      <h6 className="text-lg font-semibold mb-3">Title</h6>
      <Input
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-7"
      />
      {/* MARK:tagline */}
      <h6 className="text-lg font-semibold mb-3">Tagline</h6>
      <Input
        placeholder="Enter tagline"
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        className="mb-7"
      />
      {/* MARK:role */}
      <h6 className="text-lg font-semibold mb-3">Select Role</h6>
      <select
        id="role"
        className="h-12 w-full mt-1 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none mb-7"
        onChange={(e) => setRole(e.target.value)}
      >
        <option selected>Select Role</option>
        <option value="child">Child</option>
        <option value="employee">Employee</option>
      </select>
      {/* MARK:description */}
      <h6 className="text-lg font-semibold mb-3">Description</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {/* MARK:guid */}
      <h6 className="text-lg font-semibold mb-3">Guide</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter guide"
        value={guide}
        onChange={(e) => setGuide(e.target.value)}
      />
      {/* MARK:result */}
      <h6 className="text-lg font-semibold mb-3">Recommendation for 0%-25%</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter recommendation for 0%-25%"
        value={result25}
        onChange={(e) => setResult25(e.target.value)}
      />
      <h6 className="text-lg font-semibold mb-3">Recommendation for 25%-50%</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter recommendation for 25%-50%"
        value={result50}
        onChange={(e) => setResult50(e.target.value)}
      />
      <h6 className="text-lg font-semibold mb-3">Recommendation for 50%-75%</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter recommendation for 50%-75%"
        value={result75}
        onChange={(e) => setResult75(e.target.value)}
      />
      <h6 className="text-lg font-semibold mb-3">Recommendation for 75%-100%</h6>
      <textarea
        className={
          "h-12 w-full mt-1 mb-7 block px-3 py-2 border border-neutral-300 rounded-md text-sm placeholder-lightgray bg-white focus:outline-none focus:border-neutral-300 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        }
        placeholder="Enter recommendation for 75%-100%"
        value={result100}
        onChange={(e) => setResult100(e.target.value)}
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
      <div className="flex justify-end">
        <Button className="text-md h-10" onClick={handelClick}>
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateSurvey;

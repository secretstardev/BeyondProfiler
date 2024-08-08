import SignupForm from "../components/ui/forms/SignupForm";
import logo from "../../public/assets/images/beyond_logo.png"
import mainImage from "../../public/assets/images/login_image.jpeg"

const Signup = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-[100vh]">
      <div className="lg:w-1/2 flex  justify-center items-start p-20">
        <div className="w-[70%]">
          <img
            src={logo}
            alt="logo"
          />
          <h5 className="text-[24px] font-semibold mb-3 mt-5">
            Create Your Account
          </h5>
          <p className="text-md mb-3 text-lightgray">
            Enter Your Information Below to Create Your Account
          </p>
          <SignupForm />
        </div>
      </div>
      <div className="w-1/2 h-[100vh] lg:flex hidden items-center p-10">
        <div className="w-full h-full  shadow-lg rounded-lg  p-5">
          <div className=" w-full h-full flex flex-row items-center justify-center">
            <img
              src={mainImage}
              alt="background"
              className="object-fit "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

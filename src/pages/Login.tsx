
import LoginForm from "../components/ui/forms/LoginForm";
import logo from "../../public/assets/images/beyond_logo.png"
import mainImage from "../../public/assets/images/login_image.jpeg"

const Login = () => {
  return (
    <>
      <div className="lg:flex lg:py-0 py-20 items-center justify-center w-full h-[100vh]">
        <div className="lg:w-1/2 w-full flex justify-center items-center">
          <div className="lg:flex items-center justify-start h-full">
            <div className="w-full lg:max-w-md">
              <img
                src={logo}
                alt="logo"
              />
              <h5 className="text-[26px] font-semibold mb-3 mt-10">
                Login To Your Account
              </h5>
              <p className="text-md mb-8 text-lightgray">
                Please enter your login credentials below to login
              </p>
              <LoginForm />
            </div>
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
    </>
  );
};

export default Login;

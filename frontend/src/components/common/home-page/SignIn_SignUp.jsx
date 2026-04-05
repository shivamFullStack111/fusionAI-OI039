import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DB_URL } from "@/../utils/variables";
import Loader from "../Loader";
import cookie from "js-cookie";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import {
  setAccessToken,
  setIsAuthenticated,
  setUser,
} from "../../../../store/slices/auth.slice.js";

const SignIn_SignUp = ({ buttonClassName, buttonTitle, type = "signin" }) => {
  const [pageType, setpageType] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loading, setloading] = useState(false);

    const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      setloading(true);
      if (pageType == "signup") {
        if (!name) return toast.error("Name is required");
        if (!email) return toast.error("Email is required");
        if (!password) return toast.error("Password name is required");
        if (!confirmPassword)
          return toast.error("Confirm Password is required");
        if (password !== confirmPassword)
          return toast.error("Password and Confirm Password must be same");
        if (password.length < 8)
          return toast.error(
            "Password length must be greater then lenght of 8",
          );
      } else {
        if (!email) return toast.error("Email is required");
        if (!password) return toast.error("Password name is required");
      }

      const apiURL =
        DB_URL + `${pageType == "signup" ? "/user/register" : "/user/login"}`;

      let payload = {};
      if (pageType == "signup") {
        payload = {
          name,
          email,
          password,
          confirmPassword,
        };
      } else {
        payload = {
          email,
          password,
        };
      }

      const res = await axios.post(apiURL, payload);

      if (res.data?.success) {
        toast.success(res.data.message);

        const expire_minutes_30 = new Date(
          new Date().getTime() + 30 * 60 * 1000,
        );

        Cookies.set("accessToken", res?.data?.accessToken, {
          expires: expire_minutes_30,
        });

        localStorage.setItem("user", JSON.stringify(res.data?.user));

        dispatch(setIsAuthenticated(true));
        dispatch(setUser(res.data?.user));
        dispatch(setAccessToken(res?.data?.accessToken));

      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    setpageType(type);
  }, [type]);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
                            className={"bg-white text-black  cursor-pointer rounded-full"}

          >
            {pageType == "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm text-zinc-500 dark">
          <DialogHeader>
            <DialogTitle
              className={
                "font-mono font-semibold text-center text-zinc-300 text-2xl"
              }
            >
              {pageType == "signin" ? "SignIn" : "SignUp"}
            </DialogTitle>
          </DialogHeader>
          <FieldGroup>
            {pageType !== "signin" && (
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                  placeholder="john doe"
                  className={"h-10 placeholder:text-zinc-700 text-zinc-300"}
                  id="name"
                  name="name"
                  type={"text"}
                />
              </Field>
            )}
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                value={email}
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                placeholder="john@gmail.com"
                className={"h-10 placeholder:text-zinc-700 text-zinc-300"}
                id="email"
                name="email"
                type={"email"}
                required={true}
              />
            </Field>
            <Field>
              <Label htmlFor="password">Password</Label>
              <Input
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                placeholder="john@gmail.com"
                className={"h-10 placeholder:text-zinc-700 text-zinc-300"}
                id="password"
                type={"password"}
                name="password"
                required={true}
              />
            </Field>
            {pageType == "signup" && (
              <Field>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  value={confirmPassword}
                  onChange={(e) => {
                    setconfirmPassword(e.target.value);
                  }}
                  placeholder="john@gmail.com"
                  className={"h-10 placeholder:text-zinc-700 text-zinc-300"}
                  id="confirm-password"
                  type={"password"}
                  name="confirm-password"
                  required={true}
                />
              </Field>
            )}
          </FieldGroup>
          {pageType == "signin" ? (
            <div className="text-center">
              <p className="text-zinc-400 text-sm">
                Not have an account?{" "}
                <span
                  onClick={() => {
                    setpageType("signup");
                  }}
                  className="text-blue-500 cursor-pointer font-mono "
                >
                  SignUp
                </span>
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-zinc-400 text-sm">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setpageType("signin");
                  }}
                  className="text-blue-500 cursor-pointer font-mono "
                >
                  SignIn
                </span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              className={"w-full h-10 font-mono  font-semibold"}
              type="submit"
              disabled={loading}
            >
              {!loading && <>{pageType == "signin" ? "SignIn" : "SignUp"}</>}
              {loading && <Loader />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default SignIn_SignUp;

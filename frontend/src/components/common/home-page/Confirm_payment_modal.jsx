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
import axios from "axios";
import { useSelector } from "react-redux";
import { DB_URL } from "../../../../utils/variables.js";
import cookies from "js-cookie";
import toast from "react-hot-toast";
import Loader from "../Loader.jsx";
import { useState } from "react";

const Confirm_payment_modal = ({
  title,
  variant = "outline",
  className,
  plan,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false);

  const handlePayment = async () => {
    setloading(true);
    const accessToken = cookies.get("accessToken");
    try {
      const res = await axios.post(
        `${DB_URL}/payment/create-order`,
        {
          amount: plan?.price,
          currency: "INR",
          planType: plan?.planType,
          userId: user?._id,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );

      if (!res.data.success) {
        return toast.error(res.data?.message);
      }

      const options = {
        key: res.data.key,
        amount: plan?.price,
        currency: "INR",
        name: plan.planType + " Plan",
        order_id: res.data.order_id,
        handler: async (response) => {
          const verifyRes = await axios.post(
            `${DB_URL}/payment/verify-payment`,
            { ...response, planId: plan?._id, userId: user?._id },
            {
              headers: {
                Authorization: accessToken,
              },
            },
          );
          if (verifyRes.data.success) alert("✅ Payment Successful!");
          else alert("❌ Payment Failed!");
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleFreePayment = async () => {
    setloading(true);
    const accessToken = cookies.get("accessToken");
    try {
      const res = await axios.post(
        `${DB_URL}/payment/purchase-free-plan`,
        {
          planType: plan?.planType,
          userId: user?._id,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );

      if (!res.data.success) {
        return toast.error(res.data?.message);
      }

      const options = {
        key: res.data.key,
        amount: plan?.price,
        currency: "INR",
        name: plan.planType + " Plan",
        order_id: res.data.order_id,
        handler: async (response) => {
          const verifyRes = await axios.post(
            `${DB_URL}/payment/verify-payment`,
            { ...response, planId: plan?._id, userId: user?._id },
            {
              headers: {
                Authorization: accessToken,
              },
            },
          );
          if (verifyRes.data.success) alert("✅ Payment Successful!");
          else alert("❌ Payment Failed!");
        },
      };
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className={className} variant={variant}>
            {title}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm dark">
          <DialogHeader>
            <DialogTitle className={`text-zinc-100`}>
              Confirm Payment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to purchase this plan
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 text-xl text-zinc-500 ">
            <p className="font-semibold"> Continue to pay ₹{plan?.price}</p>
            <p className="text-[15px] mt-1 text-zinc-500">
              Plan name "{plan?.planType}"
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button className={"text-zinc-400"} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={loading}
              onClick={() => {
                if (plan?.planType == "free") return handleFreePayment();
                return handlePayment();
              }}
              type="submit"
            >
              {loading && <Loader />}
              {!loading && " Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default Confirm_payment_modal;

import { success } from "zod";
import { Member } from "../schemas/member.schema.js";
import bcrypt from "bcrypt";

export const createMember = async (req, res) => {
  try {
    const { userId, name, email, password, role } = req.body;

    // Check if member with the same email already exists
    const isExistingMember = await Member.findOne({ email });

    if (isExistingMember) {
      return res.send({
        success: false,
        message: "Member with this email already exists.",
      });
    }

    // checking admin already created maximum members of their plan
    const userCurrentPlan = req.userCurrentPlan;

    const totalUserMembers = await Member.countDocuments({
      userId: userId,
    });

    if (totalUserMembers >= userCurrentPlan?.totalTeamMembers) {
      return res.send({
        success: false,
        message: "Maximum user already created!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new member
    const newMember = new Member({
      userId,
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newMember.save();

    return res.send({ success: true, message: "Member created successfully.",member:newMember });
  } catch (error) {
    console.error("Error creating member:", error);
    return res.send({ success: false, message: error.message });
  }
};

export const getUserAllMember = async (req, res) => {
  try {
    const { userId } = req?.body;

    if (!userId)
      return res.send({ success: false, message: "User id is required!" });

    const members = await Member.find({ userId }).select("-password");

    return res.send({ success: true, message: "Get all members of user",members });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};
export const deleteMember = async (req, res) => {
  try {
    const { memberId } = req?.body;

    if (!memberId)
      return res.send({
        success: false,
        message: "Member id is required to delete",
      });

    const member = await Member.findOne({ _id: memberId });

    if (!member)
      return res.send({ success: false, message: "Member not found!" });
if (member?.userId?.toString() !== req?.user?._id?.toString()) {
      return res.send({
        success: false,
        message: "You cannot delete this member",
      });
    }

    await Member.findOneAndDelete({ _id: memberId });

    return res.send({ success: true, message: "Member deleted!" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

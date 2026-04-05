import { Section } from "../schemas/section.schema.js";

export const createSection = async (req, res) => {
  try {
    if (!req?.body?.sectionName) {
      return res.send({ success: false, message: "Section name is required" });
    }
    if (req?.body?.knowledgeSourceIds?.length == 0) {
      return res.send({ success: false, message: "Add must 1 knowledge" });
    }
    if (!req?.body?.tone) {
      return res.send({ success: false, message: "Tone is required" });
    }

    const { sectionName = "", knowledgeSourceIds = [], tone = "" } = req?.body;

    const section = await Section.findOne({ sectionName });

    if (section)
      return res.send({
        success: false,
        message: "Section is already exists with this name",
      });

    let allowedTopicsArray = [];
    let blockedTopicsArray = [];

    if (req?.body?.allowedTopics.length > 0) {
      allowedTopicsArray = req?.body?.allowedTopics
        ?.split(",")
        .map((topic) => topic?.trim());
    }
    if (req?.body?.blockedTopics.length > 0) {
      blockedTopicsArray = req?.body?.blockedTopics
        ?.split(",")
        .map((topic) => topic?.trim());
    }

    const newSection = new Section({
      userId: req?.user?._id,
      sectionName,
      description: req?.body?.description || "",
      knowledgeSourceIds,
      tone,
      allowedTopics: allowedTopicsArray,
      blockedTopics: blockedTopicsArray,
    });

    await newSection.save();

    return res.send({
      success: true,
      message: "Section created",
      section: newSection,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const getAllSection = async (req, res) => {
  try {
    const sections = await Section.find({ userId: req?.user?._id })
      .populate("knowledgeSourceIds")
      .sort({ createdAt: -1 });

    return res.send({
      success: true,
      message: "sections get",
      sections: sections,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const updateSection = async (req, res) => {
  try {
    if (!req?.body?.sectionId)
      return res.send({ success: false, message: "Section id is required" });

    const dataThatChange = {};
    if (req?.body?.sectionName) {
      dataThatChange.sectionName = req?.body?.sectionName;
    }
    if (req?.body?.description) {
      dataThatChange.description = req?.body?.description;
    }
    if (req?.body?.knowledgeSourceIds) {
      dataThatChange.knowledgeSourceIds = req?.body?.knowledgeSourceIds;
    }
    if (req?.body?.isActive == true || req?.body?.isActive == false) {
      dataThatChange.isActive = req?.body?.isActive;
    }
    if (req?.body?.tone) {
      dataThatChange.tone = req?.body?.tone;
    }
    dataThatChange.allowedTopics =
      req?.body?.allowedTopics?.trim()?.length > 0
        ? req?.body?.allowedTopics
            ?.trim()
            .split(",")
            .filter((topic) => topic !== "")
        : [];

    dataThatChange.blockedTopics =
      req?.body?.blockedTopics?.trim()?.length > 0
        ? req?.body?.blockedTopics
            ?.trim()
            .split(",")
            .filter((topic) => topic !== "")
        : [];

    const section = await Section.findOneAndUpdate(
      {
        userId: req?.user?._id,
        _id: req?.body?.sectionId,
      },
      { $set: dataThatChange },
      { returnDocument: "after" },
    );

    return res.send({ success: true, message: "Section updated", section });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const deleteSection = async (req, res) => {
  try {
    if (!req.body?.sectionId) {
      return res.send({ success: false, message: "Section id is required" });
    }

    await Section.findOneAndDelete({ _id: req?.body?.sectionId });

    return res.send({ success: true, message: "Section deleted" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

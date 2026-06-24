import mongoose from "mongoose";

const codingQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Arrays",
        "Strings",
        "Linked List",
        "Trees",
        "Graphs",
        "Dynamic Programming",
        "Backtracking",
        "System Design",
        "General",
      ],
      default: "General",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    acceptanceRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    companies: {
      type: [String],
      default: [],
    },

    constraints: {
      type: String,
      default: "",
      trim: true,
    },

    starterCode: {
      type: String,
      default: "",
    },

    testCases: {
      type: [
        {
          input: {
            type: String,
            required: true,
            trim: true,
          },
          expectedOutput: {
            type: String,
            required: true,
            trim: true,
          },
          isSample: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const CodingQuestion = mongoose.model(
  "CodingQuestion",
  codingQuestionSchema,
);

export default CodingQuestion;

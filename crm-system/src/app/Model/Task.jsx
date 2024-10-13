import mongoose from "mongoose";

const Taskschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    linkedType: {
        type: String,
        required: true,
      },
    linkedTo: {
      type: String,
      required: true,
    },
    assignedType: {
        type: String,
        required: true,
      },
    assignedTo: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tasks =
  mongoose.models.Tasks || mongoose.model("Tasks", Taskschema);

export default Tasks;

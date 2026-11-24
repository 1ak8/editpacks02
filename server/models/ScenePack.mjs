import mongoose from "mongoose"

const scenePackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    subtitle: { type: String, required: true, trim: true, maxlength: 200 },
    type: { type: String, required: true, trim: true, maxlength: 80 },
    year: { type: String, trim: true, maxlength: 40 },
    cuts: { type: String, trim: true, maxlength: 40 },
    downloads: { type: String, trim: true, maxlength: 40 },
    spec: { type: String, trim: true, maxlength: 100 },
    cast: { type: String, trim: true, maxlength: 240 },
    image: { type: String, required: true, trim: true, maxlength: 2048 },
    palette: { type: String, match: /^#[0-9a-fA-F]{6}$/ },
    code: { type: String, trim: true, maxlength: 40, unique: true, sparse: true },
  },
  { timestamps: true },
)

export const ScenePack = mongoose.model("ScenePack", scenePackSchema)

import mongoose, { Schema } from "mongoose";

// Setup schemas that map to our Zod types
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "student", enum: ["student", "admin"] },
    createdAt: { type: Date, default: Date.now }
});
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

const CompanySchema = new Schema({
    name: { type: String, required: true },
    roles: [{ type: String, required: true }],
    eligibility: { type: String, required: true },
    packageInfo: { type: String, required: true },
    selectionProcess: { type: String, required: true },
});
CompanySchema.set('toJSON', { virtuals: true });
CompanySchema.set('toObject', { virtuals: true });

const PlacementEventSchema = new Schema({
    companyId: { type: String, required: true },
    date: { type: Date, required: true },
    deadline: { type: Date, required: true },
    role: { type: String, required: true },
});
PlacementEventSchema.set('toJSON', { virtuals: true });
PlacementEventSchema.set('toObject', { virtuals: true });

const MaterialSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    role: { type: String, required: true },
    link: { type: String, required: true },
    tags: [{ type: String }],
});
MaterialSchema.set('toJSON', { virtuals: true });
MaterialSchema.set('toObject', { virtuals: true });

const TestResultSchema = new Schema({
    userId: { type: String, required: true },
    testType: { type: String, required: true },
    score: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});
TestResultSchema.set('toJSON', { virtuals: true });
TestResultSchema.set('toObject', { virtuals: true });

const ConversationSchema = new Schema({
    title: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
ConversationSchema.set('toJSON', { virtuals: true });
ConversationSchema.set('toObject', { virtuals: true });

const MessageSchema = new Schema({
    conversationId: { type: String, required: true },
    role: { type: String, required: true },
    content: { type: String, required: true },
    recommendedMaterials: [{ type: String }],
    recommendedQuizzes: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});
MessageSchema.set('toJSON', { virtuals: true });
MessageSchema.set('toObject', { virtuals: true });

// Export Models
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export const CompanyModel = mongoose.models.Company || mongoose.model("Company", CompanySchema);
export const PlacementEventModel = mongoose.models.PlacementEvent || mongoose.model("PlacementEvent", PlacementEventSchema);
export const MaterialModel = mongoose.models.Material || mongoose.model("Material", MaterialSchema);
export const TestResultModel = mongoose.models.TestResult || mongoose.model("TestResult", TestResultSchema);
export const ConversationModel = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
export const MessageModel = mongoose.models.Message || mongoose.model("Message", MessageSchema);

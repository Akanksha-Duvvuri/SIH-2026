import mongoose, { Document, Schema } from "mongoose";
export interface IPortfolio extends Document { freelancerId: mongoose.Types.ObjectId; title:string; description:string; link?:string; imageUrl?:string; skills:string[]; createdAt:Date; updatedAt:Date; }
const schema=new Schema<IPortfolio>({freelancerId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},title:{type:String,required:true,trim:true,maxlength:120},description:{type:String,required:true,trim:true,maxlength:3000},link:{type:String,trim:true},imageUrl:{type:String,trim:true},skills:{type:[String],default:[]}}, {timestamps:true});
export const Portfolio=mongoose.model<IPortfolio>("Portfolio",schema);

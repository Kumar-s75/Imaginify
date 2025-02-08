
import { Schema,model,models } from "mongoose";
//clerkId,email,username,photo,firstname,lastName,planId,creditBalance
// interface User {
//     email: string;
//     username: string;
//     clerkId: string;
//     photo: string;
//     firstName: string;
//     lastName: string;
//     planId: string;
//     creditBalance: number;
//   }
const UserSchema=new Schema({
    email:{type:String,required:true,unique:true},
    username:{type:String,required:true,unique:true},
    clerkId:{type:String,required:true,unique:true},
    photo:{type:String,required:true},
    firstName:{type:String},
    lastName:{type:String},
    planId:{type:Number,default:1},
    creditBalance:{type:Number,default:10},
});

const User=models?.User||model("User",UserSchema);
export default User;
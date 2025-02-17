import {Schema,model ,models} from "mongoose";

//createdAt,stripeId,amount,plan,credits,buyer
const TransactionSchema=new Schema({
    createdAt:{
        type:Date,
        default:Date.now,
    },
    paypalId:{
        type:String,
        required:true,
        unique:true
    },
    amount:{
        type:Number,
        required:true,
    },
    plan:{
        type:String,
    },
    credits:{
        type:Number,

    },
    buyer:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

const Transaction=models?.Transaction||model("Transaction",TransactionSchema);
export default Transaction;
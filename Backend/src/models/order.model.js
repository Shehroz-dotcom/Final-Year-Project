import mongoose from 'mongoose'
const orderSchema =  new mongoose.Schema({
    UserId: {
        type:String , required:true
    }

})

 const OrderModel =  mongoose.model.user || mongoose.model("Order" , orderSchema)
 export default OrderModel
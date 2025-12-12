import OrderModel from '../../models/order.model.js';
import UserModel from '../../models/food.model.js';
// integrate opayment systme  here

//paymenyt function  here or in a separate file

const PlaceOrder = async (req, res) => {
  const { cart,  totalPrice } = req.body;
  console.log("place order = " , cart , totalPrice);
  const token = req.cookies.accessToken
  console.log("accessToken =  from place order controller" , token);
  
};

export { PlaceOrder };

const  FetchOrder = async  (req,res) => {
    try {
        const {orderId} = req.body
    } catch (error) {
        console.error("from  fetch order controller",error)
    }

}

export {FetchOrder}
import { useEffect, useState } from "react";
import Button from "../../Components/Button/Button.jsx";
import Urls from "../../Utils/Url";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListFood = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true); // ✅ start loading
      const response = await axios.get(`${Urls.dev}/api/v1/food/listfood`);
      if (response.data.success) {
        const data = response.data.data;
        setList(data);

        //if case when  the list is empty is not running  and jumping straight to else case need fix
        if (Array.isArray(data) && data.length === 0) {
          toast.info("Food list is empty");
        }
      } else {
        toast.error("Failed to fetch List ");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching food List");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  //deleteFood Function
  const Deletefood = async (foodName, publicId) => {
    try {
      const response = await axios.post(`${Urls.dev}/api/v1/food/deleteFood`, {
        foodName,
        publicId,
      });

      if (response.data.success) {
        toast.success("Food deleted successfully");
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to delete food");
      }

      //console.log("DeleteFood:", foodName, publicId);
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Error deleting food");
    }
  };

  const fun = (food) => {
    console.log(food);
  };
  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return <div className="text-white text-xl ">loading...</div>;
  }

  return (
    <>
      <div className="px-8 sm:px-6 md:px-16 py-6">
        <p className="text-xl sm:text-2xl font-semibold text-white mb-6">
          All Foods List
        </p>
        <div className="">
          {list.map((food, index) => (
            <div
              className="flex flex-col lg:flex lg:flex-row my-4 rounded-xl bg-black/30 backdrop-blur-sm "
              key={index}
            >
              {/* image section */}
              <img
                src={food.food_image_url}
                alt=""
                className="h-120 w-150 object-cover lg:rounded-l-xl rounded-t-xl"
                loading="lazy"
              />
              {/* content  */}
              <div className="flex flex-col justify-between p-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm sm:text-base md:text-lg text-gray-200">
                    Name
                  </label>
                  <h5 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white">
                    {food.food_name}
                  </h5>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm sm:text-base md:text-lg text-gray-200 font-bold">
                    Description
                  </label>
                  <p className="text-white text-sm sm:text-base md:text-lg opacity-80">
                    {food.food_description}
                  </p>
                </div>
                {/* price */}
                <div className="">
                  <label className="block text-sm sm:text-base md:text-lg text-gray-200 font-bold">
                    price
                  </label>
                  <p className="text-lg sm:text-2xl md:text-3xl font-semibold text-green-400">
                    ₨ {food.food_price}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-lg sm:text-xl md:text-2xl text-gray-200 font-bold">
                    Category
                  </label>
                  <p className="text-base sm:text-lg md:text-2xl text-gray-200">
                    {food.food_category}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() =>
                      navigate(`/edit?name=${food.food_name}`)
                    }
                    variant="green"
                    className={`bg-black border-white border hover:text-black font-bold hover:border-black active:bg-green-500 active:text-black active:border-black  `}
                  >
                    Modify
                  </Button>
                  <Button
                    onClick={() =>
                      Deletefood(food.food_name, food.food_image_public_id)
                    }
                    variant="red"
                    className={`bg-black border-white border hover:text-black font-bold hover:border-black active:bg-red-500 active:text-black active:border-black`}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListFood;

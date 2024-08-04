import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";

const Loader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <InstagramIcon className="animate-spin-half text-[#8b00bae0] !w-1/4 !h-1/4" />
    </div>
  );
};

export default Loader;

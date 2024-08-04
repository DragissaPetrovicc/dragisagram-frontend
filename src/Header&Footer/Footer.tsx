import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="p-2 md:p-5 lg:p-8 xl:p-10 w-full h-[125px] flex flex-col gap-2 justify-center items-center bg-[#7D00A8] text-white border-t-2 rounded-t-xl border-[#FFDF00]">
      <span className="font-medium">Copyright ©2024. Made by</span>
      <span className="text-[#FFDF00] font-bold text-2xl">
        DRAGIŠA PETROVIĆ
      </span>
    </div>
  );
};

export default Footer;

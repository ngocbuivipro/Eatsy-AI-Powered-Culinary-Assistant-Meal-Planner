export const WelcomeHeaderSubsection = () => {
  return (
    <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] opacity-70">
        <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Manrope-Bold',Helvetica] font-bold text-[#57615b] text-[11px] tracking-[1.65px] leading-[16.5px]">
          GOOD EVENING, NGOC BUI!
        </div>
      </div>
      <div className="flex self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
        <div className="relative self-stretch mt-[-1.00px] [font-family:'Manrope-ExtraBold',Helvetica] font-extrabold text-[#2b352f] text-3xl tracking-[-0.75px] leading-9">
          What are we cooking
          <br />
          tonight?
        </div>
      </div>
    </div>
  );
};

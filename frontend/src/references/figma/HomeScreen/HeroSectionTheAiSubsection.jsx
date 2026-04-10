import icon from "./icon.svg";
import image from "./image.svg";

const stats = [
  {
    label: "PREPARATION",
    value: "35 mins",
    labelWidth: "w-[78.69px]",
    valueWidth: "w-[65.77px]",
  },
  {
    label: "DIFFICULTY",
    value: "Medium",
    labelWidth: "w-[64.5px]",
    valueWidth: "w-[68.72px]",
  },
  {
    label: "INGREDIENTS",
    value: "8 items",
    labelWidth: "w-[76.25px]",
    valueWidth: "w-[62.34px]",
  },
];

export const HeroSectionTheAiSubsection = () => {
  return (
    <div className="grid grid-cols-1 grid-rows-[427.50px_406px] h-fit gap-8">
      <div className="relative row-[1_/_2] col-[1_/_2] self-center w-full h-fit flex flex-col items-start">
        <div className="absolute w-[calc(100%_+_32px)] h-[calc(100%_+_32px)] -top-4 -left-4 bg-[#d5e9c433] rounded-[32px] blur-[32px] opacity-50" />
        <div className="justify-center self-stretch w-full flex-[0_0_auto] bg-[#f0f5f0] rounded-3xl aspect-[0.8] flex flex-col items-start relative overflow-hidden">
          <div className="relative self-stretch w-full h-[427.5px] bg-[url(/creamy-mushroom-risotto.png)] bg-cover bg-[50%_50%]" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 absolute top-6 right-6 bg-[#ffffffcc] rounded-xl border border-solid border-[#ffffff33] shadow-[0px_1px_2px_#0000000d] backdrop-blur-[6px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(6px)_brightness(100%)]">
          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            <img
              className="relative w-[12.83px] h-[12.83px]"
              alt="Icon"
              src={icon}
            />
          </div>
          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            <div className="relative flex items-center w-[64.28px] h-[17px] mt-[-1.00px] [font-family:'Manrope-Bold',Helvetica] font-bold text-[#2b352f] text-[11px] tracking-[-0.28px] leading-[16.5px] whitespace-nowrap">
              AI SELECTED
            </div>
          </div>
        </div>
      </div>
      <div className="relative row-[2_/_3] col-[1_/_2] self-center w-full h-fit flex flex-col items-start gap-10">
        <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Manrope-Bold',Helvetica] font-bold text-[#57615b] text-[10px] tracking-[2.00px] leading-[15px]">
              DAILY AI SUGGESTION
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] opacity-70">
              <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Manrope-Medium',Helvetica] font-medium text-[#57615b] text-sm tracking-[0] leading-5">
                Tonight, we suggest...
              </div>
            </div>
            <div className="flex self-stretch w-full flex-col items-start relative flex-[0_0_auto]">
              <div className="relative self-stretch mt-[-1.00px] [font-family:'Manrope-ExtraBold',Helvetica] font-extrabold text-[#2b352f] text-4xl tracking-[-1.80px] leading-9">
                Creamy Mushroom
                <br />
                Risotto
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
          <button className="all-[unset] box-border inline-flex items-center justify-center gap-3 px-[107.75px] py-5 relative flex-[0_0_auto] bg-[#526347] rounded-lg shadow-[0px_20px_40px_#5263470f]">
            <div className="justify-center w-[90.48px] h-7 [font-family:'Manrope-Bold',Helvetica] font-bold text-[#eafed9] text-lg text-center tracking-[0] leading-7 relative flex items-center mt-[-1.00px] whitespace-nowrap">
              Let&#39;s Cook
            </div>
            <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
              <img className="relative w-[15px] h-5" alt="Icon" src={image} />
            </div>
          </button>
          <button className="all-[unset] box-border inline-flex items-center justify-center pl-[97.84px] pr-[97.85px] py-5 relative flex-[0_0_auto] bg-[#d5e9c4] rounded-lg">
            <div className="justify-center w-[146.31px] h-7 [font-family:'Manrope-Bold',Helvetica] font-bold text-[#46573b] text-lg text-center tracking-[0] leading-7 relative flex items-center mt-[-1.00px] whitespace-nowrap">
              Something else?
            </div>
          </button>
        </div>
        <div className="flex w-[351.66px] items-center gap-16 pt-2 pb-0 px-0 relative flex-[0_0_auto] mr-[-9.66px]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="inline-flex flex-col items-start relative flex-[0_0_auto]"
            >
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div
                  className={`${stat.labelWidth} h-[15px] [font-family:'Manrope-Bold',Helvetica] font-bold text-[#57615b] text-[10px] tracking-[1.00px] leading-[15px] relative flex items-center mt-[-1.00px] whitespace-nowrap`}
                >
                  {stat.label}
                </div>
              </div>
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div
                  className={`${stat.valueWidth} h-7 [font-family:'Manrope-SemiBold',Helvetica] font-semibold text-[#2b352f] text-lg tracking-[0] leading-7 relative flex items-center mt-[-1.00px] whitespace-nowrap`}
                >
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

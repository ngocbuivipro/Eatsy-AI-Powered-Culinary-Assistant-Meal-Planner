import bottomNavBar from "./bottom-nav-bar.svg";
import { HeroSectionTheAiSubsection } from "./HeroSectionTheAiSubsection";
import icon2 from "./icon-2.svg";
import { SectionCuratedForSubsection } from "./SectionCuratedForSubsection";
import { WelcomeHeaderSubsection } from "./WelcomeHeaderSubsection";

export const EatsyHome = () => {
  return (
    <div className="flex flex-col min-h-[2598px] items-start relative bg-[#f8faf6] overflow-x-hidden">
      <div className="flex flex-col max-w-screen-xl min-h-[2598px] items-start gap-12 pt-24 pb-32 px-6 relative w-full flex-[0_0_auto]">
        <WelcomeHeaderSubsection />
        <HeroSectionTheAiSubsection />
        <SectionCuratedForSubsection />
      </div>
      <div className="flex flex-col w-[390px] items-start absolute top-0 left-0 bg-[#f8faf6b2] backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)]">
        <div className="flex h-16 items-center justify-between px-6 py-0 relative self-stretch w-full">
          <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <img
                className="relative w-[19px] h-[18px]"
                alt="Icon"
                src={icon2}
              />
            </div>
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <div className="w-[59.14px] h-8 [font-family:'Manrope-ExtraBold',Helvetica] font-extrabold text-[#526347] text-2xl tracking-[-1.20px] leading-8 relative flex items-center mt-[-1.00px] whitespace-nowrap">
                Eatsy
              </div>
            </div>
          </div>
          <div className="w-8 h-8 bg-[#e2eae3] rounded-xl flex flex-col items-start relative overflow-hidden">
            <div className="relative max-w-8 w-8 h-8 aspect-[1] bg-[url(/user-profile.png)] bg-cover bg-[50%_50%]" />
          </div>
        </div>
      </div>
      <img
        className="absolute -left-10 bottom-0 w-[470px] h-40"
        alt="Bottom nav bar"
        src={bottomNavBar}
      />
    </div>
  );
};

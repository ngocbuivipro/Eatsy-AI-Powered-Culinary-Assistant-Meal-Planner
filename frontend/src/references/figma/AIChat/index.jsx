import { useState } from "react";
import bottomNavBar from "./bottom-nav-bar.svg";
import icon from "./icon.svg";
import icon2 from "./icon-2.svg";
import icon3 from "./icon-3.svg";
import icon4 from "./icon-4.svg";
import icon5 from "./icon-5.svg";
import image from "./image.svg";

const messages = [
  {
    id: 1,
    type: "user",
    text: "What can I cook with the spinach and\neggs I have?",
    time: "10:42 AM",
  },
  {
    id: 2,
    type: "ai",
    time: "10:43 AM",
    intro: "You've got great ingredients! Here are\n3 quick ideas:",
    suggestions: [
      {
        icon: image,
        alt: "Icon",
        bold: "Spinach Omelet:",
        rest: " Classic and\nhealthy. Add some cheese if you\nhave it!",
        height: "h-[68.25px]",
        prClass: "pr-[23.84px]",
        wClass: "w-[206.14px]",
        pbClass: "pb-0",
      },
      {
        icon: icon2,
        alt: "Icon",
        bold: "Shakshuka-style:",
        rest: " Wilt spinach in a\npan, crack eggs on top and cover.",
        height: "h-[45.5px]",
        prClass: "pr-[4.98px]",
        wClass: "w-[225px]",
        pbClass: "pb-[0.62px]",
      },
      {
        icon: icon3,
        alt: "Icon",
        bold: "Green Scramble:",
        rest: " Chop spinach\nfinely and scramble into your eggs.",
        height: "h-[45.5px]",
        prClass: "pr-[7.23px]",
        wClass: "w-[222.75px]",
        pbClass: "pb-[0.62px]",
      },
    ],
  },
  {
    id: 3,
    type: "user",
    text: "The Spinach Omelet sounds perfect.\nHow many calories is that?",
    time: "10:44 AM",
  },
];

export const EatsyAiChat = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex flex-col items-start pt-24 pb-[225.25px] px-6 relative bg-[#f8faf6] overflow-x-hidden">
      <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
        {messages.map((msg) => {
          if (msg.type === "user") {
            return (
              <div
                key={msg.id}
                className="flex flex-col items-start pl-12 pr-0 py-0 w-full flex-[0_0_auto] relative self-stretch"
              >
                <div className="flex flex-col items-end gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="inline-flex flex-col items-start pl-5 pr-[36.03px] py-3.5 relative flex-[0_0_auto] bg-[#d5e9c4] rounded-[22px_0px_22px_22px] shadow-[0px_1px_2px_#0000000d]">
                    <p className="relative w-[237.97px] mt-[-1.00px] [font-family:'Manrope-Regular',Helvetica] font-normal text-[#2b352f] text-sm tracking-[0] leading-[22.8px]">
                      {msg.text.split("\n").map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="inline-flex flex-col items-start px-1 py-0 relative flex-[0_0_auto]">
                    <div className="relative flex items-center w-[46.91px] h-[15px] mt-[-1.00px] [font-family:'Manrope-SemiBold',Helvetica] font-semibold text-[#57615b] text-[10px] tracking-[0.50px] leading-[15px] whitespace-nowrap">
                      {msg.time}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === "ai") {
            return (
              <div
                key={msg.id}
                className="pl-0 pr-12 py-0 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]"
              >
                <div className="gap-2 flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="inline-flex flex-col items-start pt-0 pb-1 px-0 relative flex-[0_0_auto]">
                    <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
                      <div className="flex w-6 h-6 items-center justify-center relative bg-[#526347] rounded-xl">
                        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                          <img
                            className="relative w-[12.83px] h-[12.83px]"
                            alt="Icon"
                            src={icon}
                          />
                        </div>
                      </div>
                      <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                        <div className="relative flex items-center w-[49.53px] h-[15px] mt-[-1.00px] [font-family:'Manrope-Bold',Helvetica] font-bold text-[#526347] text-[10px] tracking-[1.00px] leading-[15px] whitespace-nowrap">
                          EATSY AI
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex flex-col items-start gap-[12.62px] pt-[12.88px] pb-3.5 px-5 relative flex-[0_0_auto] bg-[#f0f5f0] rounded-[0px_22px_22px_22px] border border-solid border-[#e2eae3] shadow-[0px_1px_2px_#0000000d]">
                    <p className="relative w-[241.95px] h-[46px] [font-family:'Manrope-Regular',Helvetica] font-normal text-[#2b352f] text-sm tracking-[0] leading-[22.8px]">
                      {msg.intro.split("\n").map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                    <div className="inline-flex flex-col items-start gap-2 relative flex-[0_0_auto]">
                      {msg.suggestions.map((suggestion, idx) => {
                        const restLines = suggestion.rest.split("\n");
                        return (
                          <div
                            key={idx}
                            className={`relative self-stretch w-full ${suggestion.height}`}
                          >
                            <div className="inline-flex flex-col items-start pt-0.5 pb-0 px-0 absolute top-0 left-0">
                              <img
                                className="relative w-[8.75px] h-[11.67px]"
                                alt={suggestion.alt}
                                src={suggestion.icon}
                              />
                            </div>
                            <div
                              className={`inline-flex flex-col items-start pl-0 ${suggestion.prClass} pt-0 ${suggestion.pbClass} absolute -top-px left-[22px]`}
                            >
                              <p
                                className={`relative ${suggestion.wClass} mt-[-1.00px] [font-family:'Manrope-Bold',Helvetica] font-normal text-[#2b352f] text-sm tracking-[0] leading-[14px]`}
                              >
                                <span className="font-bold leading-[22.8px]">
                                  {suggestion.bold}
                                </span>
                                {restLines.map((line, i) => (
                                  <span key={i}>
                                    {i === 0 ? (
                                      <span className="[font-family:'Manrope-Regular',Helvetica]">
                                        {line}
                                      </span>
                                    ) : (
                                      <>
                                        <span className="font-bold leading-[22.8px]">
                                          <br />
                                        </span>
                                        <span className="[font-family:'Manrope-Regular',Helvetica]">
                                          {line}
                                        </span>
                                      </>
                                    )}
                                  </span>
                                ))}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="inline-flex flex-col items-start px-1 py-0 relative flex-[0_0_auto]">
                    <div className="relative flex items-center w-[46.77px] h-[15px] mt-[-1.00px] [font-family:'Manrope-SemiBold',Helvetica] font-semibold text-[#57615b] text-[10px] tracking-[0.50px] leading-[15px] whitespace-nowrap">
                      {msg.time}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
      <div className="flex flex-col max-w-2xl w-full items-start px-6 py-0 absolute left-0 bottom-24">
        <div className="flex items-center gap-3 pl-6 pr-2 py-2 relative self-stretch w-full flex-[0_0_auto] bg-[#ffffffcc] rounded-xl border border-solid border-[#e2eae3] shadow-[0px_10px_30px_#0000000d] backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)]">
          <div className="flex flex-col items-start pt-2 pb-[9px] px-3 relative flex-1 grow">
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Eatsy AI anything..."
                className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Manrope-Regular',Helvetica] font-normal text-[#57615b] text-sm tracking-[0] leading-[normal] w-full bg-transparent border-0 outline-none placeholder-[#57615b]"
              />
            </div>
          </div>
          <button
            type="button"
            className="flex w-10 h-10 items-center justify-center relative bg-[#526347] rounded-xl cursor-pointer"
            aria-label="Send message"
          >
            <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
              <img
                className="relative w-[15.83px] h-[13.33px]"
                alt="Icon"
                src={icon4}
              />
            </div>
          </button>
        </div>
      </div>
      <header className="flex w-[390px] h-16 items-center justify-between px-6 py-0 absolute top-0 left-0 bg-[#f8faf6b2] backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)]">
        <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            <img
              className="relative w-[19px] h-[18px]"
              alt="Icon"
              src={icon5}
            />
          </div>
          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
            <div className="relative flex items-center w-[59.14px] h-8 mt-[-1.00px] [font-family:'Manrope-ExtraBold',Helvetica] font-extrabold text-[#526347] text-2xl tracking-[-1.20px] leading-8 whitespace-nowrap">
              Eatsy
            </div>
          </div>
        </div>
        <div className="flex w-8 h-8 items-center justify-center relative bg-[#dee5d7] rounded-xl overflow-hidden">
          <div className="flex-1 grow bg-[url(/user-profile.png)] bg-cover bg-[50%_50%] relative self-stretch" />
        </div>
      </header>
      <img
        className="absolute -left-10 bottom-0 w-[470px] h-40"
        alt="Bottom nav bar"
        src={bottomNavBar}
      />
    </div>
  );
};

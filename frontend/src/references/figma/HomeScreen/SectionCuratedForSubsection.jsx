export const SectionCuratedForSubsection = () => {
  const recipes = [
    { time: "20 MIN", name: "Honey Glazed\nSalmon" },
    { time: "25 MIN", name: "Garlic Butter\nShrimp" },
    { time: "30 MIN", name: "Thai Green Curry" },
    { time: "40 MIN", name: "Roasted Veggie\nBowl" },
    { time: "22 MIN", name: "Creamy Truffle\nPasta" },
    { time: "15 MIN", name: "Avocado\nSourdough" },
    { time: "20 MIN", name: "Spicy Tuna Poke" },
    { time: "45 MIN", name: "Classic Steak Frites" },
    { time: "60 MIN", name: "Handmade\nMargherita" },
    { time: "10 MIN", name: "Super Berry Bowl" },
  ];

  return (
    <div className="flex flex-col items-start gap-8 pt-12 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Manrope-Bold',Helvetica] font-bold text-[#2b352f] text-2xl tracking-[-0.60px] leading-8">
          Curated for you
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 w-full">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className={`relative w-full h-fit flex flex-col items-start gap-[11px]${
              index === 2 || index === 9 ? " pt-0 pb-5 px-0" : ""
            }`}
          >
            <div className="flex flex-col items-start justify-center relative self-stretch w-full flex-[0_0_auto] bg-[#e9f0e9] rounded-2xl overflow-hidden aspect-[1]">
              <div className="relative self-stretch w-full h-[161px]" />
            </div>
            <div className="flex flex-col items-start px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] opacity-60">
                <div className="relative flex items-center self-stretch mt-[-1.00px] [font-family:'Manrope-Bold',Helvetica] font-bold text-[#57615b] text-[11px] tracking-[0.55px] leading-[16.5px]">
                  {recipe.time}
                </div>
              </div>
              <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative self-stretch mt-[-1.00px] [font-family:'Manrope-Bold',Helvetica] font-bold text-[#2b352f] text-base tracking-[0] leading-5 whitespace-pre-line">
                  {recipe.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

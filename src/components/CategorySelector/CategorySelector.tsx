import type { CategorySelectorProps } from "./types"

const CategorySelector = ({ categories, selected, onChange, disabledExcludeCategoryBtn }: CategorySelectorProps) => {
  return (
    <div className="w-full text-center">
      <h2 className="text-lg sm:text-xl text-shadow-lg text-[#795649] font-bold text-center drop-shadow w-full my-6">
        Select a category to exclude from the game
      </h2>
      <p className="text-base text-shadow-lg text-[#795649] text-center w-full my-6">Once both players selected one, the game starts</p>
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2 pb-4">
        {categories.map((category) => {
          const isSelected = selected?.includes(category)

          return (
            <button
              key={category}
              onClick={() => onChange(category)}
              className={`px-3 py-2 text-sm rounded font-serif transition
                  border-2 border-[#c0a080]
                  ${isSelected
                  ? 'bg-[#a67c52] text-white shadow-[0px_0_5px_5px_rgba(255,255,255,0.3)]'
                  : 'bg-[radial-gradient(circle,_#e7d2aa,_#d6c095)] text-[#4b3a2f] '}
                    shadow-[2px_2px_0px_#a67c52]
                    active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]
                    active:translate-y-[2px]
                  ${disabledExcludeCategoryBtn && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-[0px_0_5px_5px_rgba(255,255,255,0.2)]'
                }
`}
            >
              {category}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CategorySelector;

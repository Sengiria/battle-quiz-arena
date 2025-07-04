import type { Category } from "../../constants/categories"

export type CategorySelectorProps = {
  categories: (Category)[]
  selected: Category | null
  onChange: (category: Category) => void
  disabledExcludeCategoryBtn: boolean
}


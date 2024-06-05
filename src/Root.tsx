import { cn, getColor } from '@/lib/utils'
import { useCategories } from '@/store'

export const Root = ({ children }: { children: React.ReactNode }) => {
  const { categories, activeCategoryIndex } = useCategories()
  return (
    <div className="w-screen h-screen gap-4 bg-gray-100 p-2 grid grid-cols-4">
      <div
        className={cn(
          'pointer-events-none absolute right-0 -top-40 h-64 w-full bg-opacity-10 blur-3xl rounded-full',
          activeCategoryIndex === null
            ? 'hidden'
            : getColor(categories[activeCategoryIndex].color),
        )}
      />
      {children}
    </div>
  )
}

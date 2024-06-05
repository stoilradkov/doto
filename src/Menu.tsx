import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { COLORS, cn, getColor } from '@/lib/utils'
import { useCategories } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'

const categorySchema = z.object({
  name: z.string().min(1, {
    message: 'The name should not be empty.',
  }),
  color: z.enum(COLORS),
})

type CategorySchema = z.infer<typeof categorySchema>

export const Menu = () => {
  const {
    categories,
    activeCategoryIndex,
    setActiveCategoryIndex,
    setActiveIndex,
    addCategory,
    todos,
  } = useCategories()

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const [newCategory, setNewCategory] = useState<CategorySchema | null>(null)

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: COLORS[0],
    },
  })

  const onSubmit = (payload: CategorySchema) => {
    if (categories.some((category) => category.name === payload.name)) {
      form.setError('name', { message: 'Category already exists.' })
      form.setFocus('name')
      return
    }
    setNewCategory(payload)
    setIsCategoryModalOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setActiveCategoryIndex('prev')
      } else if (event.key === 'ArrowDown') {
        setActiveCategoryIndex('next')
      } else if (event.key === 'm' && event.ctrlKey) {
        setIsCategoryModalOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setActiveCategoryIndex])

  useEffect(() => {
    if (newCategory !== null) {
      const interval = setTimeout(() => {
        addCategory(newCategory.name, newCategory.color)
        setNewCategory(null)
      }, 100)
      return () => clearTimeout(interval)
    }
  }, [addCategory, newCategory])

  const color = form.watch('color')

  return (
    <nav className="bg-white rounded-2xl col-span-1 z-10">
      <motion.ul layout className="p-10 space-y-2">
        <AnimatePresence initial={false}>
          {categories.map((category, i) => (
            <motion.li
              initial={
                // i === categories.length - 1 && newCategory !== null
                { opacity: 0, y: 20 }
                // : false
              }
              animate={{
                y: 0,
                opacity: 1,
              }}
              layout
              transition={{ duration: 0.3 }}
              key={category.name}
              tabIndex={-1}
            >
              <Button
                tabIndex={-1}
                onClick={() => setActiveIndex(i)}
                variant={'none'}
                className={cn(
                  'hover:bg-gray-100 p-2 px-3 font-semibold text-sm rounded-md w-full justify-between',
                  activeCategoryIndex === i ? 'bg-gray-100' : '',
                )}
              >
                <div className="flex space-x-2 justify-start">
                  <div
                    role="presentation"
                    className={cn(
                      'rounded-md p-2 h-4 w-4 mt-0.5',
                      getColor(category.color),
                    )}
                  />
                  <span>{category.name}</span>
                </div>
                <div className="rounded-md min-w-fit w-6 h-6 px-1 bg-gray-200">
                  {todos.filter((todo) => todo.categoryIndex === i).length}
                </div>
              </Button>
            </motion.li>
          ))}
        </AnimatePresence>
        <Dialog
          open={isCategoryModalOpen}
          onOpenChange={setIsCategoryModalOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="justify-between items-center w-full"
            >
              <span>Create new list</span>
              <div className="space-x-1 flex">
                <div className="rounded-md min-w-fit w-6 h-6 px-1 bg-gray-200">
                  Ctrl
                </div>
                <div className="rounded-md min-w-fit w-6 h-6 px-1 bg-gray-200">
                  M
                </div>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New category</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fun"
                            className="w-auto"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem className="flex space-x-2 space-y-0 items-center">
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                className={cn(
                                  'rounded-md p-2 h-4 w-4',
                                  getColor(field.value),
                                )}
                              />
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="flex flex-wrap gap-2">
                                {COLORS.map((color) => (
                                  <button
                                    onClick={() => field.onChange(color)}
                                    key={color}
                                    className={cn(
                                      'rounded-md p-2 h-4 w-4 mt-0.5',
                                      getColor(color),
                                    )}
                                  />
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className={getColor(color)}>
                    Add category
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.ul>
    </nav>
  )
}

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn, getColor } from '@/lib/utils'
import { useCategories } from '@/store'
import { motion, AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'

export const Category = () => {
  const { activeCategoryIndex, categories, addTodo, removeTodo, todos } =
    useCategories()

  const [newTask, setNewTask] = useState('')
  const [keyPressed, setKeyPressed] = useState(false)
  const [removingTodoId, setRemovingTodoId] = useState<string | null>(null)

  useEffect(() => {
    if (removingTodoId !== null) {
      removeTodo(removingTodoId)
    }
  }, [removeTodo, removingTodoId])

  if (activeCategoryIndex === null) {
    return null
  }

  console.log('PRESSED', keyPressed)

  const category = categories[activeCategoryIndex]
  return (
    <div className="z-10 py-6 px-28 col-span-3 overflow-y-auto">
      <div className="flex space-x-4">
        <div
          role="presentation"
          className={cn(
            'rounded-lg h-6 min-w-[24px] max-w-[24px] w-6',
            getColor(category.color),
          )}
          aria-hidden="true"
        />
        <div className="min-w-96 space-y-6 relative">
          <h2 className="font-semibold text-xl">{category.name}</h2>
          {!keyPressed && (
            <Input
              className="bg-gray-200 rounded-xl focus:bg-white shadow-none focus:shadow-md focus-visible:ring-0"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newTask.trim().length !== 0) {
                  setKeyPressed(true)
                  addTodo(nanoid(), newTask, activeCategoryIndex)
                  setNewTask('')
                }
              }}
            />
          )}
          <motion.ul
            layout
            className="space-y-3 absolute top-[84px] w-full"
            key={activeCategoryIndex}
          >
            <AnimatePresence initial={false}>
              {todos
                .filter((todo) => todo.categoryIndex === activeCategoryIndex)
                .map((todo, i) => (
                  <motion.li
                    className="bg-white rounded-xl px-3 pt-1.5 pb-2 flex items-center space-x-2"
                    layout
                    initial={
                      i === 0 && keyPressed ? { opacity: 1, y: -58 } : false
                    }
                    animate={{
                      y: 0,
                    }}
                    onAnimationComplete={() => setKeyPressed(false)}
                    transition={{ duration: 0.3 }}
                    key={todo.id}
                  >
                    <motion.div
                      layout
                      initial={
                        i === 0 && keyPressed ? { opacity: 0, x: -20 } : false
                      }
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-4"
                    >
                      <Checkbox
                        onCheckedChange={() => {
                          setRemovingTodoId(todo.id)
                        }}
                        className="bg-gray-200 border-none shadow-none "
                      />
                    </motion.div>
                    <div className="relative">
                      <p>{todo.content}</p>
                      {removingTodoId === todo.id && (
                        <motion.div
                          role="presentation"
                          aria-hidden="true"
                          animate={{ width: 0 }}
                          exit={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-[60%] left-0 h-[2px] bg-black"
                          style={{ transform: 'translateY(-50%)' }}
                        />
                      )}
                    </div>
                  </motion.li>
                ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>
    </div>
  )
}

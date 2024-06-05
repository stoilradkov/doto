import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Color } from '../lib/utils'

interface CategoriesState {
  categories: { name: string; color: Color }[]
  activeCategoryIndex: number | null
  todos: {
    id: string
    content: string
    categoryIndex: number
  }[]
  setActiveCategoryIndex: (direction: 'next' | 'prev') => void
  setActiveIndex: (index: number) => void
  addCategory: (name: string, color: Color) => void
  addTodo: (id: string, content: string, categoryIndex: number) => void
  removeTodo: (id: string) => void
}

export const useCategories = create<CategoriesState>()(
  persist(
    (set) => ({
      categories: [
        {
          name: 'Home',
          color: 'green' as Color,
        },
        {
          name: 'Work',
          color: 'cyan' as Color,
        },
      ],
      todos: [{ id: '1', content: 'tsest', categoryIndex: 0 }],
      activeCategoryIndex: null,
      setActiveCategoryIndex: (direction) =>
        set((state) => ({
          activeCategoryIndex:
            direction === 'next'
              ? state.activeCategoryIndex === null ||
                state.activeCategoryIndex === state.categories.length - 1
                ? 0
                : state.activeCategoryIndex + 1
              : state.activeCategoryIndex === null
              ? 0
              : state.activeCategoryIndex === 0
              ? state.categories.length - 1
              : state.activeCategoryIndex - 1,
        })),
      setActiveIndex: (index) => set({ activeCategoryIndex: index }),
      addTodo: (id: string, content: string, categoryIndex: number) =>
        set((state) => ({
          todos: [{ id, content, categoryIndex }, ...state.todos],
        })),
      addCategory: (name: string, color: Color) =>
        set((state) => ({
          categories: [...state.categories, { name, color }],
        })),
      removeTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    }),
    { name: 'categories' },
  ),
)

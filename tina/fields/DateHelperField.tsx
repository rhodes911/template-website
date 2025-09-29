/* eslint-disable @typescript-eslint/no-explicit-any */
import { wrapFieldsWithMeta } from 'tinacms'

// This component adds a button to set today's date in UK format (DD-MM-YYYY)
const DateHelperField = {
  Component: wrapFieldsWithMeta(({ input, field }: any) => {
    const setToday = () => {
      const today = new Date()
      const day = String(today.getDate()).padStart(2, '0')
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const year = today.getFullYear()
      input.onChange(`${day}-${month}-${year}`)
    }

    return (
      <>
        <div className="flex items-center">
          <input
            type="text"
            id={input.name}
            className="w-full p-2 border border-gray-200 rounded-md"
            {...input}
            placeholder="DD-MM-YYYY"
          />
          <button
            type="button"
            className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md text-sm"
            onClick={setToday}
          >
            Today
          </button>
        </div>
        {field.description && (
          <p className="text-xs text-gray-500 mt-1">{field.description}</p>
        )}
      </>
    )
  }),
  parse: (value: any) => value,
}

export default DateHelperField

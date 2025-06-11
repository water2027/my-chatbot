export default function Home() {
  return (
    <div className="w-full h-full flex flex-row">
      <aside className="w-0 md:w-1/20 h-full hover:w-1/5 bg-black overflow-x-visible transition-all duration-300">
        <div className="w-10 h-10">
          {/* 展开按钮 */}
          <button
            type="button"
            className="relative w-full h-full flex flex-col justify-center items-center space-y-1.5 rounded-full transition-all duration-300 hover:bg-indigo-100 hover:backdrop-opacity-50"
            aria-label="Toggle menu"
          >
            <div
              className="w-6 h-0.5 bg-white transition-all duration-300 ease-in-out"
            >
            </div>

            <div
              className="w-6 h-0.5 bg-white transition-all duration-300 ease-in-out"
            >
            </div>

            <div
              className="w-6 h-0.5 bg-white transition-all duration-300 ease-in-out"
            >
            </div>
          </button>
          <div>
            {/* 聊天记录 */}
          </div>
        </div>
      </aside>
      <main className="w-full bg-amber-300 h-full flex flex-col px-4 py-2">
        {/* 头部栏, 放头像和模型选择 */}
        <div className="flex flex-row justify-between">
          <select name="model" id="model">
            <option value="gpt-4">gpt-4</option>
          </select>
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 p-5 text-c">
            水
          </div>
        </div>
        {/* 对话列表 */}
        <div>
        </div>
        {/* 输入框 */}
        <form className="mt-auto mx-auto bg-amber-800 w-2/3 flex flex-row">
          <textarea className="w-full" rows={3} name="message" id="message"></textarea>
          <button type="submit" className="rounded-full bg-amber-300 h-5 w-5 flex items-center justify-center p-6 m-auto">S</button>
        </form>
      </main>
    </div>
  )
}

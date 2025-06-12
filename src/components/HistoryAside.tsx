export default function ChatHistory() {
  return (
    <aside className="relative w-0 md:w-1/20 h-full hover:w-1/5 overflow-x-visible transition-all duration-300 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-black">
      <div className="w-10 h-10">
        {/* 展开按钮 */}
        <button
          type="button"
          className="relative w-full h-full z-10 flex flex-col justify-center items-center space-y-1.5 rounded-full transition-all duration-300 hover:bg-indigo-100 hover:backdrop-opacity-50"
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
  )
}

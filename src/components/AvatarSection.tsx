interface AvatarSectionProps {
  isOnline: boolean
  onLoginClick?: () => void
  onLogoutClick?: () => void
}

export default function AvatarSection({
  isOnline,
  onLoginClick,
  onLogoutClick,
}: AvatarSectionProps) {
  return (
    <div className="group relative flex flex-col items-center flex-shrink-0">
      {/* 主头像容器 */}
      <div className="relative">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-200 ${
            isOnline
              ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
          }`}
        >
          <span className="text-xs">
            {isOnline ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* 状态指示器小圆点 */}
        <div
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white transition-colors duration-200 ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
      </div>

      {/* 悬停显示的操作菜单 */}
      <div className="absolute top-3/4 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 pointer-events-none group-hover:pointer-events-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 min-w-max">
          {isOnline
            ? (
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 pb-1 border-b border-gray-100">
                    已登录
                  </div>
                  <button
                    type="button"
                    onClick={onLogoutClick}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors duration-150 block w-full text-left"
                  >
                    登出
                  </button>
                </div>
              )
            : (
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 pb-1 border-b border-gray-100">
                    未登录
                  </div>
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-150 block w-full text-left"
                  >
                    登录
                  </button>
                </div>
              )}
        </div>

        {/* 小三角箭头 */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
      </div>
    </div>
  )
}

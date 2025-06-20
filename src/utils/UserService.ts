import { createClient } from './supabase/server'

class UserService {
  async getCurrentUser() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // 未登录或者cookie错误
      throw new Error('user not login')
    }

    return user
  }

  async getUserInfo() {
    const user = await this.getCurrentUser()

    const supabase = await createClient()

    const { data, error } = await supabase.from('users').select('id, token').eq('id', user.id).single()

    if (error) {
      throw new Error('fail to fetch userInfo')
    }

    return data
  }

  async updateToken(diff: number) {
    if (diff <= 0)
      return Promise.reject(new Error('diff must be greater than 0'))
    const userInfo = await this.getUserInfo()
    const supabase = await createClient()
    const { error } = await supabase
      .from('users')
      .update({ token: userInfo.token - diff })
      .eq('id', userInfo.id)
      .single()

    if (error) {
      Promise.reject(error)
    }
  }
}

export default new UserService()

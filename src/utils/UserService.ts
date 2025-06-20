import admin from './supabase/admin'
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
    const user = await this.getCurrentUser()
    const { error } = await admin.rpc('update_user_token', {
      user_id: user.id,
      token_diff: diff,
    })

    if (error) {
      return Promise.reject(error)
    }
  }
}

export default new UserService()

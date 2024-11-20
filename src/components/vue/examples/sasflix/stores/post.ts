import type { ListResponse, Post, PostComment, ReactionType } from '../types/post'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { useCookie } from '../composables/useCookie'

export const usePostStore = defineStore('post', () => {
  const comments = ref([] as PostComment[])
  interface ListResponseWithPostComments extends ListResponse {
    comments: PostComment[]
  }
  const getCommentsForPost = async (id: string) => {
    const { data, error } = await useApi<ListResponseWithPostComments>(`/posts/${id}/comments`)
    if (error.value) {
      console.error('Failed to fetch comments:', error.value)
      return comments
    }
    if (data.value) {
      comments.value = data.value.comments
    }
    return comments
  }

  interface RemovedComment {
    [id: number]: number[]
  }
  const getRemovedCommentsFromStorage = (): RemovedComment => {
    const cookie = useCookie<RemovedComment>('APP_removedComments')
    return cookie.value.get() || {}
  }

  const setRemovedCommentsToStorage = (removedComments: RemovedComment) => {
    const cookie = useCookie<RemovedComment>('APP_removedComments')
    cookie.value.set(removedComments)
  }

  const setRemovedComments = (postId: number) => {
    const removedComments = getRemovedCommentsFromStorage()
    const removedCommentsOfCurrentPost = removedComments[postId] || []
    removedCommentsOfCurrentPost.forEach((commentId) => {
      const comment = comments.value.find(item => item.id === commentId)
      if (comment) {
        comment.isRemoved = true
      }
    })
  }

  const removeComment = (commentId: number, postId: number) => {
    const removedComments = getRemovedCommentsFromStorage()
    const removedCommentsOfCurrentPost = removedComments[postId] || []
    const commentIndex = removedCommentsOfCurrentPost.indexOf(commentId)
    if (commentIndex === -1) {
      removedCommentsOfCurrentPost.push(commentId)
      removedComments[postId] = removedCommentsOfCurrentPost
      setRemovedCommentsToStorage(removedComments)
      const comment = comments.value.find(item => item.id === commentId)
      if (comment)
        comment.isRemoved = true
    }
  }

  const restoreComment = (commentId: number, postId: number) => {
    const removedComments = getRemovedCommentsFromStorage()
    const removedCommentsOfCurrentPost = removedComments[postId] || []
    const commentIndex = removedCommentsOfCurrentPost.indexOf(commentId)
    if (commentIndex !== -1) {
      removedCommentsOfCurrentPost.splice(commentIndex, 1)
      setRemovedCommentsToStorage(removedComments)
      const comment = comments.value.find(item => item.id === commentId)
      if (comment)
        comment.isRemoved = false
    }
  }

  const post = ref({} as Post)
  async function getPost(id: string) {
    const { data, error } = await useApi<Post>(`/posts/${id}`)
    if (error.value) {
      throw new Error('Post not found')
    }
    if (data.value) {
      post.value = data.value
    }
    return post
  }

  const posts = ref([] as Post[])
  interface ListResponseWithPosts extends ListResponse {
    posts: Post[]
  }
  const getPosts = async () => {
    const { data, error } = await useApi<ListResponseWithPosts>('/posts?limit=5')
    if (error.value) {
      console.error('Failed to fetch posts:', error.value)
      return posts
    }
    if (data.value) {
      posts.value = data.value.posts
    }
    return posts
  }

  interface PostRate {
    [id: number]: ReactionType
  }

  const getPostsRatesFromStorage = (): PostRate => {
    const cookie = useCookie<PostRate>('APP_postsRates')
    return cookie.value.get() || {}
  }

  const setPostsRatesToStorage = (postsRates: PostRate) => {
    const cookie = useCookie<PostRate>('APP_postsRates')
    cookie.value.set(postsRates)
  }

  const setRatedPosts = () => {
    const postsRates = getPostsRatesFromStorage()
    if (postsRates) {
      for (const [id, type] of Object.entries(postsRates)) {
        const postFromList = posts.value.find(item => item.id === Number(id))
        const currentPost = post.value.id === Number(id) ? post.value : null
        if (postFromList) {
          postFromList.userRate = type
        }
        if (currentPost) {
          currentPost.userRate = type
        }
      }
    }
  }

  const ratePost = (type: ReactionType, id: number) => {
    const postFromList = posts.value.find(item => item.id === id)
    const currentPost = post.value.id === id ? post.value : null
    let isRateRemoved = false
    if (postFromList) {
      if (postFromList.userRate === type) {
        delete postFromList.userRate
        isRateRemoved = true
      }
      else {
        postFromList.userRate = type
      }
    }
    if (currentPost) {
      if (currentPost.userRate === type) {
        delete currentPost.userRate
        isRateRemoved = true
      }
      else {
        currentPost.userRate = type
      }
    }
    const postsRates = getPostsRatesFromStorage()
    if (postsRates) {
      if (isRateRemoved) {
        delete postsRates[id]
      }
      else {
        postsRates[id] = type
      }
      postsRates[id] = type
      setPostsRatesToStorage(postsRates)
    }
    else {
      if (isRateRemoved)
        return false
      setPostsRatesToStorage({ [id]: type })
    }
  }

  return {
    post,
    posts,
    getPost,
    getPosts,
    ratePost,
    setRatedPosts,
    comments,
    getCommentsForPost,
    setRemovedComments,
    removeComment,
    restoreComment
  }
})

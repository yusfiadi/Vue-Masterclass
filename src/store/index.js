import Vue from "vue"
import Vuex from "vuex"
import firebase from 'firebase'
import {
  countObjectProperties
} from '@/utils'

Vue.use(Vuex)

const makeAppendChildToParentMutation = ({
  parent,
  child
}) => (state, {
  childId,
  parentId
}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId);
  }

export default new Vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters: {
    authUser(state) {
      // return state.users[state.authId]
      return {}
    },
    // Menggunakan high order functions
    // userPostsCount(state) {
    //   return function (id) {
    //     return countObjectProperties(state.users[id].posts)
    //   }
    // }
    // versi arrow function
    userPostsCount: state => id => countObjectProperties(state.users[id].posts),
    userThreadsCount: state => id => countObjectProperties(state.users[id].threads),
    threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1
  },
  actions: {
    createPost({
      commit,
      state
    }, post) {
      const postId = `greatPost ${Math.random()}`
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setPost', {
        post,
        postId
      })
      commit('appendPostToThread', {
        childId: postId,
        parentId: post.threadId
      })
      commit('appendPostToUser', {
        childId: postId,
        parentId: post.userId
      })
      // untuk dapetin firstPostId setelah createPost
      return Promise.resolve(state.posts[postId])
    },
    createThread({
      commit,
      state,
      dispatch
    }, {
      title,
      text,
      forumId
    }) {
      return new Promise((resolve, reject) => {
        const threadId = `greatThread ${Math.random()}`
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)
        const thread = {
          forumId,
          title,
          publishedAt,
          userId,
          ".key": threadId
        }
        commit('setThread', {
          thread,
          threadId
        })
        commit('appendThreadToForum', {
          childId: threadId,
          parentId: forumId
        })
        commit('appendThreadToUser', {
          childId: threadId,
          parentId: userId
        })

        dispatch('createPost', {
          text,
          threadId
        }).then(
          post => {
            commit('setThread', {
              threadId,
              thread: {
                ...thread,
                firstPostId: post['.key']
              }
            })
          }
        )
        resolve(state.threads[threadId])
      })
    },
    updateThread({
      commit,
      state,
      dispatch
    }, {
      title,
      text,
      id
    }) {
      return new Promise((resolve, reject) => {
        const thread = state.threads[id]
        const newThread = {
          ...thread,
          title
        }
        commit('setThread', {
          thread: newThread,
          threadId: id
        })
        dispatch('updatePost', {
          id: thread.firstPostId,
          text
        }).then(() => {
          resolve(newThread)
        })
      })
    },
    updatePost({
      state,
      commit
    }, {
      id,
      text
    }) {
      return new Promise((resolve, reject) => {
        const post = state.posts[id]
        commit('setPost', {
          postId: id,
          post: {
            ...post,
            text,
            edited: {
              at: Math.floor(Date.now() / 1000),
              by: state.authId
            }
          }
        })
        resolve(post)
      })
    },
    updateUser({
      commit
    }, user) {
      commit('setUser', {
        userId: user['.key'],
        user
      })
    },
    fetchCategory({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'categories', id, emoji: 'category gan...' })
    },

    fetchForum({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'forums', id, emoji: 'forum gann...' })
    },
    fetchThread({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id, emoji: 'thread gan....' })
    },
    fetchPost({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'posts', id, emoji: 'post gan...' })
    },
    fetchUser({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id, emoji: 'user gan..' })
    },
    fetchCategories({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'categories', ids, emoji: 'categories sis' })
    },
    fetchForums({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'forums', ids, emoji: 'forums sis' })
    },
    fetchThreads(context, { ids }) {
      return context.dispatch('fetchItems', { resource: 'threads', ids, emoji: 'threads sis' })
    },
    fetchPosts({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids, emoji: 'posts sis' })
    },
    fetchUsers({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'users', ids, emoji: 'users sis' })
    },
    fetchAllCategories({ state, commit }) {
      console.log(`haloo all categories`)
      return new Promise((resolve, reject) => {
        firebase.database().ref('categories').once('value', snapshot => {
          const categoriesObject = snapshot.val()
          Object.keys(categoriesObject).forEach(categoryId => {
            const category = categoriesObject[categoryId]
            commit('setItem', { resource: 'categories', id: categoryId, item: category })
          })
        })
        resolve(Object.values(state.categories))
      })
    },
    fetchItem({ state, commit }, { id, emoji, resource }) {
      console.log(`haloo ${emoji}, ${id}`)
      return new Promise((resolve, reject) => {
        firebase.database().ref(resource).child(id).once('value', snapshot => {
          commit('setItem', { resource, id: snapshot.key, item: snapshot.val() })
          resolve(state[resource][id])
        })
      })
    },
    fetchItems({ dispatch }, { ids, resource, emoji }) {
      ids = Array.isArray(ids) ? ids : Object.keys(ids)
      return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
    }
  },
  mutations: {
    setPost(state, {
      postId,
      post
    }) {
      Vue.set(state.posts, postId, post);
    },
    setUser(state, {
      user,
      userId
    }) {
      Vue.set(state.users, userId, user);
    },
    setThread(state, {
      thread,
      threadId
    }) {
      Vue.set(state.threads, threadId, thread);
    },
    setItem(state, {
      item,
      id,
      resource
    }) {
      item['.key'] = id
      Vue.set(state[resource], id, item);
    },
    appendPostToThread: makeAppendChildToParentMutation({
      child: 'posts',
      parent: 'threads'
    }),
    appendPostToUser: makeAppendChildToParentMutation({
      child: 'posts',
      parent: 'users'
    }),
    appendThreadToForum: makeAppendChildToParentMutation({
      child: 'threads',
      parent: 'forums'
    }),
    appendThreadToUser: makeAppendChildToParentMutation({
      child: 'threads',
      parent: 'users'
    })
  }
})

import Vue from 'vue'

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

export default {
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
  appendContributorToThread: makeAppendChildToParentMutation({
    child: 'contributors',
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

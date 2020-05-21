import firebase from "firebase";

export default {
  createPost({ commit, state }, post) {
    const postId = firebase
      .database()
      .ref("posts")
      .push().key;
    post.userId = state.authId;
    post.publishedAt = Math.floor(Date.now() / 1000);

    const updates = {};
    updates[`posts/${postId}`] = post;
    updates[`threads/${post.threadId}/posts/${postId}`] = postId;
    updates[`threads/${post.threadId}/contributors/${post.userId}`] =
      post.userId;
    updates[`users/${post.userId}/posts/${postId}`] = postId;
    firebase
      .database()
      .ref()
      .update(updates)
      .then(() => {
        commit("setItem", {
          resource: "posts",
          item: post,
          id: postId
        });
        commit("appendPostToThread", {
          childId: postId,
          parentId: post.threadId
        });
        commit("appendContributorToThread", {
          childId: post.userId,
          parentId: post.threadId
        });
        commit("appendPostToUser", {
          childId: postId,
          parentId: post.userId
        });
        // untuk dapetin firstPostId setelah createPost
        return Promise.resolve(state.posts[postId]);
      });
  },
  createThread({ commit, state, dispatch }, { title, text, forumId }) {
    return new Promise((resolve, reject) => {
      const threadId = firebase
        .database()
        .ref("threads")
        .push().key;
      const postId = firebase
        .database()
        .ref("posts")
        .push().key;
      const userId = state.authId;
      const publishedAt = Math.floor(Date.now() / 1000);
      const thread = {
        forumId,
        title,
        publishedAt,
        userId,
        firstPostId: postId,
        posts: {}
      };
      thread.posts[postId] = postId;
      const post = {
        text,
        publishedAt,
        threadId,
        userId
      };

      const updates = {};
      // set the thread
      updates[`threads/${threadId}`] = thread;
      // append to forum
      updates[`forums/${forumId}/threads/${threadId}`] = threadId;
      // append to user
      updates[`users/${userId}/threads/${threadId}`] = threadId;

      updates[`posts/${postId}`] = post;
      updates[`users/${userId}/posts/${postId}`] = postId;
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          // update thread
          commit("setItem", {
            resource: "threads",
            item: thread,
            id: threadId
          });
          commit("appendThreadToForum", {
            childId: threadId,
            parentId: forumId
          });
          commit("appendThreadToUser", {
            childId: threadId,
            parentId: userId
          });

          // update post
          commit("setItem", {
            resource: "posts",
            item: post,
            id: postId
          });
          commit("appendPostToThread", {
            childId: postId,
            parentId: post.threadId
          });
          commit("appendPostToUser", {
            childId: postId,
            parentId: post.userId
          });

          resolve(state.threads[threadId]);

          // untuk dapetin firstPostId setelah createPost
          // return Promise.resolve(state.posts[postId])
        });
    });
  },
  updateThread({ commit, state, dispatch }, { title, text, id }) {
    return new Promise((resolve, reject) => {
      const thread = state.threads[id];
      const post = state.posts[thread.firstPostId];

      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      };

      const updates = {};
      updates[`posts/${thread.firstPostId}/text`] = text;
      updates[`posts/${thread.firstPostId}/edited`] = edited;
      updates[`threads/${id}/title`] = title;
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          commit("setThread", {
            thread: {
              ...thread,
              title
            },
            threadId: id
          });
          commit("setPost", {
            postId: thread.firstPostId,
            post: {
              ...post,
              text,
              edited
            }
          });
          resolve(post);
        });
    });
  },
  updatePost({ state, commit }, { id, text }) {
    return new Promise((resolve, reject) => {
      const post = state.posts[id];
      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      };
      commit("setPost", {
        postId: id,
        post: {
          ...post,
          text,
          edited
        }
      });

      const updates = {
        text,
        edited
      };
      firebase
        .database()
        .ref("posts")
        .child(id)
        .update(updates)
        .then(() => {
          commit("setPost", {
            postId: id,
            post: {
              ...post,
              text,
              edited
            }
          });
          resolve(post);
        });
    });
  },
  updateUser({ commit }, user) {
    commit("setUser", {
      userId: user[".key"],
      user
    });
  },
  fetchCategory: ({ dispatch }, { id }) =>
    dispatch("fetchItem", {
      resource: "categories",
      id,
      emoji: "category gan..."
    }),
  fetchForum: ({ dispatch }, { id }) =>
    dispatch("fetchItem", {
      resource: "forums",
      id,
      emoji: "forum gann..."
    }),
  fetchThread: ({ dispatch }, { id }) =>
    dispatch("fetchItem", {
      resource: "threads",
      id,
      emoji: "thread gan...."
    }),
  fetchPost: ({ dispatch }, { id }) =>
    dispatch("fetchItem", {
      resource: "posts",
      id,
      emoji: "post gan..."
    }),
  fetchUser: ({ dispatch }, { id }) =>
    dispatch("fetchItem", {
      resource: "users",
      id,
      emoji: "user gan.."
    }),

  fetchCategories: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", {
      resource: "categories",
      ids,
      emoji: "categories sis"
    }),
  fetchForums: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", {
      resource: "forums",
      ids,
      emoji: "forums sis"
    }),
  fetchThreads: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", {
      resource: "threads",
      ids,
      emoji: "threads sis"
    }),
  fetchPosts: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", {
      resource: "posts",
      ids,
      emoji: "posts sis"
    }),
  fetchUsers: ({ dispatch }, { ids }) =>
    dispatch("fetchItems", {
      resource: "users",
      ids,
      emoji: "users sis"
    }),
  fetchAllCategories({ state, commit }) {
    console.log(`haloo all categories`);
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref("categories")
        .once("value", snapshot => {
          const categoriesObject = snapshot.val();
          Object.keys(categoriesObject).forEach(categoryId => {
            const category = categoriesObject[categoryId];
            commit("setItem", {
              resource: "categories",
              id: categoryId,
              item: category
            });
          });
          resolve(Object.values(state.categories));
        });
    });
  },
  fetchItem({ state, commit }, { id, emoji, resource }) {
    console.log(`haloo ${emoji}, ${id}`);
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(resource)
        .child(id)
        .once("value", snapshot => {
          commit("setItem", {
            resource,
            id: snapshot.key,
            item: snapshot.val()
          });
          resolve(state[resource][id]);
        });
    });
  },
  fetchItems({ dispatch }, { ids, resource, emoji }) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids);
    return Promise.all(
      ids.map(id =>
        dispatch("fetchItem", {
          id,
          resource,
          emoji
        })
      )
    );
  }
};

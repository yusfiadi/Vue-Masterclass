import { countObjectProperties } from "@/utils";

export default {
  authUser(state) {
    return state.authId ? state.users[state.authId] : null;
  },
  // Menggunakan high order functions
  // userPostsCount(state) {
  //   return function (id) {
  //     return countObjectProperties(state.users[id].posts)
  //   }
  // }
  // versi arrow function
  userPosts: state => id => {
    const user = state.users[id]
    if (user.posts) {
      return Object.values(state.posts).filter(
        post => post.userId === id
      );
    }
    return [];
  },
  userPostsCount: state => id => countObjectProperties(state.users[id].posts),
  userThreadsCount: state => id =>
    countObjectProperties(state.users[id].threads),
  threadRepliesCount: state => id =>
    countObjectProperties(state.threads[id].posts) - 1
};

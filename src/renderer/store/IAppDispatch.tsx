// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
import { store } from './index';

export type IAppDispatch = typeof store.dispatch;

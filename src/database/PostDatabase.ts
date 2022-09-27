import { inputSaveLikeDTO, IPostDB } from "../models/Post";
import BaseDatabase from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "Labook_Posts";
  public static TABLE_LIKES = "Labook_Likes";

  public savePost = async (post: IPostDB): Promise<string> => {
    const postDB: IPostDB = {
      id: post.id,
      content: post.content,
      user_id: post.user_id,
    };

    await this.getConnection().insert(postDB).into(PostDatabase.TABLE_POSTS);

    return `Post criado com sucesso!`;
  };

  public getAllPosts = async () => {
    const result = await this.getConnection()
      .select("*")
      .from(PostDatabase.TABLE_POSTS);

    return result;
  };

  public getLikes = async (postId: string) => {
    const result = await this.getConnection()
      .select()
      .from(PostDatabase.TABLE_LIKES)
      .count("id AS likes")
      .where({ post_id: postId });

    return result[0].likes;
  };

  public getPost = async (id: string) => {
    const result = await this.getConnection()
      .select("*")
      .from(PostDatabase.TABLE_POSTS)
      .where({ id });
    return result[0];
  };

  public deletePost = async (id: string): Promise<string> => {
    await this.getConnection()
      .delete()
      .from(PostDatabase.TABLE_POSTS)
      .where({ id });

    return `Post deletado com sucesso!`;
  };

  public checkLike = async (postId: string, userId: string) => {
    const result = await this.getConnection()
      .select("*")
      .from(PostDatabase.TABLE_LIKES)
      .where({ post_id: postId })
      .andWhere({ user_id: userId });
    return result[0];
  };

  public insertLike = async (input: inputSaveLikeDTO): Promise<string> => {
    const { id, postId, userId } = input;
    await this.getConnection()
      .insert({
        id,
        post_id: postId,
        user_id: userId,
      })
      .into(PostDatabase.TABLE_LIKES);

    return `Você curtiu o post`;
  };

  public deslike = async (postId: string, userId: string): Promise<string> => {
    await this.getConnection()
      .delete()
      .from(PostDatabase.TABLE_LIKES)
      .where({ post_id: postId })
      .andWhere({ user_id: userId });

    return `Você descurtiu o post`;
  };
}

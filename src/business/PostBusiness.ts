import { PostDatabase } from "../database/PostDatabase";
import { AuthorizationError } from "../errors/AuthorizationError";
import { ParamsError } from "../errors/ParamsError";
import { NotFoundError } from "./../errors/NotFoundError";
import {
  inputDeleteDTO,
  inputLikeDTO,
  inputPostDTO,
  inputSaveLikeDTO,
  IPostDB,
  Post,
} from "../models/Post";
import { USER_ROLES } from "../models/User";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private authenticator: Authenticator
  ) {}

  public createPost = async (input: inputPostDTO) => {
    const { content, token } = input;

    if (!content || !token) {
      throw new ParamsError();
    }

    const verifyToken = this.authenticator.getTokenPayload(token) as any;
    if (!verifyToken) {
      throw new AuthorizationError();
    }

    const id = this.idGenerator.generate();

    const post: IPostDB = {
      id,
      content,
      user_id: verifyToken.id,
    };

    const response = await this.postDatabase.savePost(post);

    return response;
  };

  public getPost = async (token: string) => {
    if (!token) {
      throw new ParamsError();
    }

    const verifyToken = this.authenticator.getTokenPayload(token) as any;
    if (!verifyToken) {
      throw new AuthorizationError();
    }

    const postsDB = await this.postDatabase.getAllPosts();

    const posts = postsDB.map((post) => {
      return new Post(post.id, post.content, post.user_id);
    });

    for (let post of posts) {
      const postId = post.getId();
      const likes = await this.postDatabase.getLikes(postId);
      post.setLikes(likes);
    }

    const responseType = posts.map((post) => {
      return new Post(
        post.getId(),
        post.getContent(),
        post.getUserId(),
        post.getLikes()
      );
    });

    return responseType;
  };

  public deletePost = async (input: inputDeleteDTO) => {
    const { postId, token } = input;

    if (!token) {
      throw new ParamsError();
    }

    const verifyToken = this.authenticator.getTokenPayload(token) as any;
    if (!verifyToken) {
      throw new AuthorizationError();
    }

    const checkPost = await this.postDatabase.getPost(postId);
    if (!checkPost) {
      throw new NotFoundError();
    }

    const getPost = await this.postDatabase.getPost(postId);

    if (
      verifyToken.role !== USER_ROLES.ADMIN &&
      verifyToken.id !== getPost.user_id
    ) {
      throw new AuthorizationError();
    }

    const deletePost = await this.postDatabase.deletePost(postId);

    return deletePost;
  };

  public like = async (input: inputLikeDTO) => {
    const { postId, token } = input;

    if (!postId || !token) {
      throw new ParamsError();
    }

    const verifyToken = this.authenticator.getTokenPayload(token) as any;
    if (!verifyToken) {
      throw new AuthorizationError();
    }

    const checkPost = await this.postDatabase.getPost(postId);
    if (!checkPost) {
      throw new NotFoundError();
    }

    const checkLike = await this.postDatabase.checkLike(postId, verifyToken.id);
    if (checkLike) {
      throw new Error("Você ja curtiu esse post!");
    }

    const id = Date.now().toString();

    const inputLike: inputSaveLikeDTO = {
      id,
      postId,
      userId: verifyToken.id,
    };

    const saveLike = this.postDatabase.insertLike(inputLike);

    return saveLike;
  };

  public deslike = async (input: inputLikeDTO) => {
    const { postId, token } = input;

    if (!postId || !token) {
      throw new ParamsError();
    }

    const verifyToken = this.authenticator.getTokenPayload(token) as any;
    if (!verifyToken) {
      throw new AuthorizationError();
    }

    const checkPost = await this.postDatabase.getPost(postId);
    if (!checkPost) {
      throw new NotFoundError();
    }

    const checkLike = await this.postDatabase.checkLike(postId, verifyToken.id);
    if (!checkLike) {
      throw new Error("Você não curtiu esse post!");
    }

    const saveDeslike = this.postDatabase.deslike(postId, verifyToken.id);

    return saveDeslike;
  };
}

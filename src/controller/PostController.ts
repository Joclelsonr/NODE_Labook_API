import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { inputDeleteDTO, inputLikeDTO, inputPostDTO } from "../models/Post";

export class PostController {
  constructor(private postBusiness: PostBusiness) {}

  public create = async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const token = req.headers.authorization as string;

      const input: inputPostDTO = {
        content,
        token,
      };

      const response = await this.postBusiness.createPost(input);

      res.status(201).send({ message: response });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .send({ message: error.message || error.sqlMessage });
    }
  };

  public posts = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;

      const response = await this.postBusiness.getPost(token);

      res.status(200).send(response);
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .send({ message: error.message || error.sqlMessage });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const postId = req.params.id;
      const token = req.headers.authorization as string;

      const input: inputDeleteDTO = {
        postId,
        token,
      };

      const response = await this.postBusiness.deletePost(input);

      res.status(200).send({ message: response });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .send({ message: error.message || error.sqlMessage });
    }
  };

  public like = async (req: Request, res: Response) => {
    try {
      const { postId } = req.body;
      const token = req.headers.authorization as string;

      const input: inputLikeDTO = {
        postId,
        token,
      };

      const response = await this.postBusiness.like(input);

      res.status(200).send({ message: response });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .send({ message: error.message || error.sqlMessage });
    }
  };

  public deslike = async (req: Request, res: Response) => {
    try {
      const { postId } = req.body;
      const token = req.headers.authorization as string;

      const input: inputLikeDTO = {
        postId,
        token,
      };

      const response = await this.postBusiness.deslike(input);

      res.status(200).send({ message: response });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .send({ message: error.message || error.sqlMessage });
    }
  };
}

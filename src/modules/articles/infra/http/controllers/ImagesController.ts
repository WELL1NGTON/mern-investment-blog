import { Request, Response } from "express";
import UploadImageService from "@modules/articles/services/UploadImageService";
import ListImagesService from "@modules/articles/services/ListImagesService";
import DeleteImageService from "@modules/articles/services/DeleteImageService";

export default class ImagesController {
  public async upload(request: Request, response: Response): Promise<Response> {
    const file = request.file;

    if (!file)
      return response.status(400).json({ msg: "Erro no upload do arquivo." });

    const size = request.body.size ? parseInt(request.body.size) : null;

    const tags = request.body.tags
      ? request.body.tags.map((tag: string) => tag.toUpperCase())
      : [];

    const protocol = request.protocol;

    const host = request.get("host");

    const uploadImage = new UploadImageService();

    const userId = request.body.user.id;

    const res = await uploadImage.execute({
      file,
      protocol,
      host: host ? host : "",
      userId,
      tags,
      size,
    });

    return response.status(201).json(res);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { fileName } = request.params;

    const deleteImage = new DeleteImageService();

    await deleteImage.execute({ fileName });

    return response.status(201).json({
      msg: `Imagem ${fileName} excluida com sucesso!`,
    });
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const limit = Number(request.query["limit"]) || 10;
    const page = Number(request.query["page"]) || 0;
    const tags: Array<any> = request.query["tag"]
      ? Array(request.query["tag"])
      : [];

    const { fileName } = request.params;

    const ListImages = new ListImagesService();

    const imageList = await ListImages.execute({ limit, page, tags });

    return response.status(201).json(imageList);
  }
}

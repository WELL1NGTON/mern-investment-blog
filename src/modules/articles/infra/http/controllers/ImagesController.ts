import { Request, Response } from "express";
import UploadImageService from "@modules/articles/services/UploadImageService";
import ListImagesService from "@modules/articles/services/ListImagesService";
import DeleteImageService from "@modules/articles/services/DeleteImageService";
import ShowImageService from "@modules/articles/services/ShowImageService";
import StatusCodes from "http-status-codes";
import AppError from "@shared/errors/AppError";
import aqp from "api-query-params";
import { IImage } from "@shared/models/image.model";

const { CREATED, OK, NO_CONTENT, BAD_REQUEST } = StatusCodes;

export default class ImagesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { slug } = request.params;

    const showImage = new ShowImageService();

    const { imageInfo } = await showImage.execute({
      slug,
    });

    // return response.status(OK).json({
    //   message: "Artigo encontrado!",
    //   article,
    // });

    return response
      .header("Content-Type", "image/jpg")
      .send(imageInfo.binData.data);
  }

  public async upload(request: Request, response: Response): Promise<Response> {
    const file = request.file;

    if (!file) throw new AppError("Erro no upload do arquivo.", BAD_REQUEST);

    // const tags = request.body.tags ? request.body.tags.map((tag: string) => tag.toUpperCase()) : [];

    // const protocol = request.protocol;

    // const host = request.get("host");

    const regex = /[\u00C0-\u00FF]*?\b[\w\u00C0-\u00FF\s\-.']+\b/gim;

    const tagsStr: string = request.body.tags;

    const regexMatch = tagsStr.match(regex);

    const tags = regexMatch
      ? regexMatch.map((tag: string) => tag.toUpperCase())
      : [];

    let size: string | number = request.body.size;

    if (typeof size === "string") size = Number(size);

    let quality: string | number = request.body.quality;

    if (typeof quality === "string") quality = Number(quality);

    const name = request.body.name;

    // const tags = request.body.tags;

    const format = request.body.format;

    const uploadImage = new UploadImageService();

    const uploadedBy = request.body.user.id;

    const res = await uploadImage.execute({
      file,
      name,
      tags,
      size,
      format,
      quality,
      uploadedBy,
    });

    return response.status(CREATED).json(res);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { slug } = request.params;

    const deleteImage = new DeleteImageService();

    await deleteImage.execute({ slug });

    return response.status(NO_CONTENT).json({
      message: `Imagem ${slug} excluida com sucesso!`,
    });
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { filter, skip, limit } = aqp<IImage>(request.query);

    // const limit = Number(request.query["limit"]) || 10;
    // const page = Number(request.query["page"]) || 0;
    // const tags: Array<any> = request.query["tag"]
    //   ? Array(request.query["tag"])
    //   : [];

    // const { fileName } = request.params;

    const ListImages = new ListImagesService();

    const imageList = await ListImages.execute({ filter, limit, skip });

    return response.status(OK).json(imageList);
  }
}

import { injectable } from "inversify";
import { action } from "mobx";
import { uploadIamge } from "@/services/image.service";

@injectable()
export default class ImageState {

    @action.bound
    uploadIamge(file, progress, success, error) {
        return uploadIamge(file, progress, success, error)
    }

}
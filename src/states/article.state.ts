import { injectable } from "inversify";
import { observable, action } from "mobx";
import { getAllTags, getAllCategories } from "@/services/article.service";

interface ITagInfo {
    Id: number;
    TagName: string;

}

interface ICategoryInfo {
    Id: number;
    CategoryName: string;
}

@injectable()
export default class ArticleState {

    @observable tagLoading: boolean = false;
    @observable categoryLoading: boolean = false;
    @observable tags: Array<ITagInfo> = [];
    @observable categories: Array<ICategoryInfo> = [];

    @action.bound
    async queryAllTags() {
        this.tagLoading = true;
        const response = await getAllTags();
        this.tags = response.map(x => {
            return {
                Id: x.Id,
                TagName: x.TagName
            }
        });
        this.tagLoading = false;
    }

    @action.bound
    async queryAllCategories() {
        this.categoryLoading = true;
        const response = await getAllCategories();
        this.categoryLoading = false;
        return response;
    }

}
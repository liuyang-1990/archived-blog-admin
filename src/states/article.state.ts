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

    @observable tags: Array<ITagInfo> = [];
    @observable categories: Array<ICategoryInfo> = [];

    @action.bound
    async queryAllTags() {
        const response = await getAllTags();
        this.tags = response.map(x => {
            return {
                Id: x.Id,
                TagName: x.TagName
            }
        });
    }

    @action.bound
    async queryAllCategories() {
        const response = await getAllCategories();
        this.categories = response.map(x => {
            return {
                Id: x.Id,
                CategoryName: x.CategoryName
            }
        });
    }

}
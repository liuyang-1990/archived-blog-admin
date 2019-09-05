import { injectable } from "inversify";
import { observable, action } from "mobx";
import { getAllTags, getAllCategories, postArticle } from "@/services/article.service";
import { message } from "antd";
import router from 'umi/router';


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
        this.tags = response && response.map(x => {
            return {
                Id: x.Id,
                TagName: x.TagName
            }
        });
    }

    @action.bound
    async queryAllCategories() {
        const response = await getAllCategories();
        this.categories = response && response.map(x => {
            return {
                Id: x.Id,
                CategoryName: x.CategoryName
            }
        });
    }


    async postArticle(params) {
        const response = await postArticle(params);
        if (response) {
            switch (response.Status) {
                case '0':
                    message.success(`${params.Id ? '更新' : '添加'}成功`);
                    router.push('/article/list');
                    break;
                case '1':
                    message.error(`${params.Id ? '更新' : '添加'}失败`);
                    break;
            }
        }
    }
}

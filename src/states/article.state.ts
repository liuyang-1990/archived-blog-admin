import { injectable } from "inversify";
import { observable, action } from "mobx";
import { getAllTags, getAllCategories, postArticle, queryByPage, deleteArticle, getArticleDetail, updateArticle } from "@/services/article.service";
import { message } from "antd";
import router from 'umi/router';
import { IArticleTableListParams, IArticleTableListItem } from "@/models/ArticleTableList";
import { ITableListData } from "@/models/TableList";


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
    @observable data!: ITableListData<IArticleTableListItem>;
    @observable loading: boolean = false;

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

    @action.bound
    async postArticle(params: Partial<IArticleTableListItem>) {
        const response = params.Id ? await updateArticle(params) : await postArticle(params);
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

    @action.bound
    async queryByPage(params?: Partial<IArticleTableListParams>) {
        this.loading = true;
        const response = await queryByPage(params);
        this.loading = false;
        if (response) {
            let pageIndex = 1;
            if (params && params.PageNum) {
                pageIndex = params.PageNum;
            }
            this.data = {
                list: response.Rows,
                pagination: {
                    total: response.TotalRows,
                    current: pageIndex
                }
            };
        }
    }

    @action.bound
    async deleteArticle(id: number) {
        const response = await deleteArticle(id);
        if (response) {
            switch (response.Status) {
                case '0':
                    message.success('删除成功');
                    this.queryByPage();
                    break;
                case '1':
                    message.error('删除失败');
                    break;
            }
        }
    }

    @action.bound
    async getArticleDetail(id: number) {
        const response = await getArticleDetail(id);
        return response;
    }
}

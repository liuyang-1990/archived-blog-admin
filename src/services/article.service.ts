import request from "@/utils/request";
import { ITagTableListItem } from "@/models/TagTableList";


export async function getAllTags(): Promise<ITagTableListItem[]> {
    return request('tag/all');
}

export async function getAllCategories() {
    return request('category/all');
}

export async function postArticle(params) {
    return request("article",{
        method: 'POST',
        data: params
    });
}
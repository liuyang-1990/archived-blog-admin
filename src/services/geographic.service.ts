import request from "@/utils/request";
import { GeographicItemType } from "@/models/Geographic";

export async function getProvince():Promise<GeographicItemType[]> {
    return request('geographic/province');
}

export async function getCity(id: string):Promise<GeographicItemType[]> {
    return request(`geographic/city/${id}`);
}
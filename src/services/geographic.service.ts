import request from "@/utils/request";

export function getProvince() {
    return request('geographic/province');
}

export function getCity(id: string) {
    return request(`geographic/city/${id}`);
}
import { injectable } from "inversify";
import { getProvince, getCity } from "@/services/geographic.service";
import { action, observable } from "mobx";
import { GeographicItemType, SelectItem } from "@/models/Geographic";

@injectable()
export default class GeographicState {

    @observable loading: boolean = false;
    @observable province: Array<GeographicItemType> = [];
    @observable city: Array<GeographicItemType> = [];


    @action
    async getProvince() {
        this.loading = true;
        const response = await getProvince();
        if (response) {
            this.province = response;
            this.loading = false;
        }
    }

    @action
    async getCity(key:string) {
        this.loading = true;
        const response = await getCity(key);
        this.loading = false;
        if (response) {
            this.city = response;
        }
        return response;
    }

}
import { action, observable } from 'mobx';
import { injectable } from "inversify";



@injectable()
class TestStore {
    @observable total: number = 0;

    @action.bound
    handClick() {
        this.total += 1;
    }

}
export default TestStore;
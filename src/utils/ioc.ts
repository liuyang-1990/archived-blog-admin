import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import {autoProvide} from "inversify-binding-decorators";
import "reflect-metadata";
import TestStore from "@/stores/test.state";
import { TYPES } from "@/models/TYPES ";


const container: Container = new Container();
autoProvide(container, TYPES.Test);
// container.bind<TestStore>(TYPES.Test).to(TestStore);
// container.load()
export const { lazyInject } = getDecorators(container, false);
export { container };

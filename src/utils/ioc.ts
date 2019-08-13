import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import "reflect-metadata";
import LoginState from "@/stores/login.state";


const container: Container = new Container();
 container.bind<LoginState>("LoginState").to(LoginState);
// container.load()
export const { lazyInject } = getDecorators(container, false);
export { container };

import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import "reflect-metadata";
import LoginState from "@/states/login.state";


const container: Container = new Container();
container.bind<LoginState>("LoginState").to(LoginState);
export const { lazyInject } = getDecorators(container);
export { container };

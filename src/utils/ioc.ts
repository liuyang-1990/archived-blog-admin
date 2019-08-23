import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import "reflect-metadata";
import LoginState from "@/states/login.state";
import UserState from "@/states/user.state";


const container: Container = new Container();
container.bind<LoginState>("LoginState").to(LoginState);
container.bind<UserState>("UserState").to(UserState);
export const { lazyInject } = getDecorators(container);
export { container };

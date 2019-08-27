import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import "reflect-metadata";
import LoginState from "@/states/login.state";
import UserState from "@/states/user.state";
import TagState from "@/states/tag.state";


const container: Container = new Container();
container.bind<LoginState>("LoginState").to(LoginState);
container.bind<UserState>("UserState").to(UserState);
container.bind<TagState>("TagState").to(TagState);
export const { lazyInject } = getDecorators(container);
export { container };

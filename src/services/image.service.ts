import { userStorage } from "@/utils/user.storage";
import settings from 'config/settings';
import router from 'umi/router';

export function uploadIamge(file, progress, success, error) {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const successFn = () =>
        success({ url: JSON.parse(xhr.responseText).WebUrl });
    const progressFn = (event: any) =>
        progress((event.loaded / event.total) * 100);
    const errorFn = () => error({ msg: '上传失败!' });
    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);
    fd.append('file', file);
    xhr.open('POST', `${settings.url}/api/v1/image/upload`, true);
    xhr.setRequestHeader("Accept", "application/json");
    const token = userStorage.AccessToken;
    const refreshToken = userStorage.RefreshToken;
    if (token && refreshToken) {
        xhr.setRequestHeader('Authorization', token);
        xhr.setRequestHeader('x-refresh-token', refreshToken);
    } else {
        router.push('/login?redirect=' + encodeURIComponent(window.location.href));
    }
    xhr.send(fd);
}

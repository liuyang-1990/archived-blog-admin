import request from "@/utils/request";

export function uploadIamge(file, progress, success, error) {
    const fd = new FormData();
    fd.append('file', file);
    request("image/upload", {
        method: 'POST',
        data: fd,
    }).then(res => {
        success({ url: res.data.WebUrl }, file)
    }).catch(err => {
        console.log(err);
        error({ msg: '上传失败!' });
    });


}
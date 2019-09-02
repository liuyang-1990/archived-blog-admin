import React from 'react';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';
import Markdown from 'braft-extensions/dist/markdown';
import MaxLength from 'braft-extensions/dist/max-length';
import HeaderId from 'braft-extensions/dist/header-id';
import { Form, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import 'braft-editor/dist/index.css';
import 'braft-editor/dist/output.css';
import 'braft-extensions/dist/table.css';


BraftEditor.use(Markdown);

class PostArticle extends React.Component<any, any>{

    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null)
        };
    }

    // componentDidMount() {
    //     BraftEditor.use([Table, Markdown, HeaderId, MaxLength({
    //         defaultValue: 5000
    //     })]);

    // }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }

    render() {
        const { editorState } = this.state
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <div className="braft-output-content">
                        <BraftEditor
                            maxLength={5000}
                            onReachMaxLength={() => console.log("不能再输入了")}
                            value={editorState}
                            onChange={this.handleEditorChange}
                        />
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }


}

export default Form.create<any>()(PostArticle);
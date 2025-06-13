import Editor from "@monaco-editor/react";

const CodePage = () => {
    return (
        <>
            <div className="w-1/2 h-190">
                <Editor
                    // height="100%"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    defaultValue="// Start coding here..."
                />
            </div>
        </>
    )
}

export default CodePage;
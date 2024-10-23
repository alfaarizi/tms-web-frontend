import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import TreeView, { flattenTree } from 'react-accessible-treeview';
import { INode } from 'react-accessible-treeview/dist/TreeView/types';
import { FolderIcon } from 'pages/InstructorTaskManager/components/StudentCodeViewer/FolderIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FileIcon } from 'pages/InstructorTaskManager/components/StudentCodeViewer/FileIcon';
import 'pages/InstructorTaskManager/containers/StudentCodeViewer/StudentCodeViewerPage.css';
import { ITreeViewOnNodeSelectProps } from 'react-accessible-treeview/dist/TreeView';
import ReactCodeMirror from '@uiw/react-codemirror';
import { LanguageSupport } from '@codemirror/language';
import { faFolderTree, faIndent } from '@fortawesome/free-solid-svg-icons';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { Col, Row } from 'react-bootstrap';
import { getExtension } from 'pages/InstructorTaskManager/utils/StudentCodeViewerUtils';
import { githubLight } from '@uiw/codemirror-theme-github';
import * as SubmissionsService from 'api/instructor/SubmissionsService';
import JSZip, { JSZipLoadOptions } from 'jszip';
import jschardet from 'jschardet';

type Params = {
    id?: string
};

type TreeNode = {
    id: string,
    name: string,
    children: TreeNode[],
    isBranch?: boolean
};

export function StudentCodeViewerPage() {
    const { t } = useTranslation();
    const params = useParams<Params>();
    const id = parseInt(params.id || '-1', 10);
    const [jsZip, setJsZip] = useState<JSZip | undefined>(undefined);
    const [treeData, setTreeData] = useState<INode[]>([]);
    const [selectedNode, setSelectedNode] = useState<ITreeViewOnNodeSelectProps | undefined>(undefined);
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    const [selectedFileExtension, setSelectedFileExtension] = useState<LanguageSupport[]>([]);
    const [withPadding, setWithPadding] = useState<boolean>(true);

    useEffect(() => {
        const downloadFile = async () => {
            const blob = await SubmissionsService.download(id);
            if (blob.type !== 'application/zip') {
                throw new Error('Invalid blob type');
            }
            const loadOptions: JSZipLoadOptions = {
                decodeFileName: (filename: string[] | Uint8Array | Buffer) => {
                    const buffer = Buffer.from(filename);
                    const { encoding } = jschardet.detect(buffer);
                    // if failed to detect encoding, fall back to utf-8
                    const decoder = new TextDecoder(encoding || 'utf-8');
                    return decoder.decode(buffer);
                },
            };
            const unZippedFiles = await JSZip.loadAsync(blob, loadOptions);
            setJsZip(unZippedFiles);
        };

        downloadFile();
    }, []);

    useEffect(() => {
        // Convert files to be able to flatten them
        const root: TreeNode = { id: 'root', name: '', children: [] };

        jsZip?.forEach((relativePath, zipEntry) => {
            // Split the path to get each component
            const pathParts = relativePath.split('/').filter((part) => part.length);
            let currentPart = root;

            pathParts.forEach((part, index) => {
                // Check if this part of the path already exists in the children
                let child = currentPart.children.find((innerChild) => innerChild.name === part);

                if (!child) {
                    // If it doesn't exist, we create a new child
                    child = {
                        id: pathParts.slice(0, index + 1).join('/'),
                        name: part,
                        children: [],
                        isBranch: zipEntry.dir,
                    };

                    currentPart.children.push(child);
                }

                currentPart = child;
            });
        });
        setTreeData(flattenTree(root));
    }, [jsZip]);

    useEffect(() => {
        const fetchSelectedFile = async () => {
            if (!jsZip || !selectedNode || selectedNode.isBranch) {
                return;
            }

            const filePath = selectedNode.element.id;
            if (typeof filePath !== 'string') { // this should not happen but to make eslint happy
                return;
            }
            const file = jsZip.file(filePath);

            if (file) {
                const extension = file.name.slice((file.name.lastIndexOf('.')) + 1);
                const extensions = getExtension(extension);
                setSelectedFileExtension(extensions);
                // load the file content and check coding
                const content = await file.async('arraybuffer');
                const buffer = Buffer.from(content);
                const { encoding } = jschardet.detect(buffer);
                // if failed to detect encoding, fall back to utf-8
                const decoder = new TextDecoder(encoding || 'utf-8');
                setSelectedFileContent(decoder.decode(buffer));
            }
        };

        fetchSelectedFile();
    }, [selectedNode]);

    return (
        <Row className="directory m-2">
            {(treeData[0]?.children?.length > 0) ? (
                <>
                    <Col
                        xs={4}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        className="shadow p-2"
                    >
                        <div className="tree-view-header">
                            <FontAwesomeIcon className="fa-fw mr-3" icon={faFolderTree} />
                            <ToolbarButton
                                onClick={() => setWithPadding(!withPadding)}
                                text={t('task.toggleIndent')}
                                icon={faIndent}
                                flip={withPadding ? 'horizontal' : undefined}
                            />
                        </div>
                        <TreeView
                            className="scroll"
                            data={treeData}
                            onNodeSelect={(node) => setSelectedNode(node)}
                            nodeRenderer={({
                                element,
                                isBranch,
                                isExpanded,
                                getNodeProps,
                                level,
                            }) => (
                                <div
                                    {...getNodeProps()} // this is responsible for the className and onClick etc.
                                    style={{ paddingLeft: (withPadding ? 20 : 0) * (level - 1) }}
                                >
                                    {isBranch ? (
                                        <>
                                            <FolderIcon
                                                isOpen={isExpanded}
                                                hasChildren={element.children?.length > 0}
                                            />
                                        </>
                                    ) : (
                                        <FileIcon filename={element.name} />
                                    )}
                                    {element.name}
                                </div>
                            )}
                        />
                    </Col>
                    <Col
                        xs={8}
                        sm={8}
                        md={8}
                        lg={8}
                        xl={8}
                        className="shadow p-2"
                    >
                        <ReactCodeMirror
                            height="90vh"
                            value={selectedFileContent}
                            extensions={selectedFileExtension}
                            theme={githubLight}
                            readOnly
                        />
                    </Col>
                </>
            ) : null}
        </Row>
    );
}

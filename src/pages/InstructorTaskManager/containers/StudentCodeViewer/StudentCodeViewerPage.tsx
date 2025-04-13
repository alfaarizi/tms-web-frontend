/* eslint-disable react/no-unstable-nested-components */
// This rule should be ignored because the design of the used 3rd-party library

import { LanguageSupport } from '@codemirror/language';
import { faFolderTree, faIndent } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { githubLight } from '@uiw/codemirror-theme-github';
import ReactCodeMirror from '@uiw/react-codemirror';
import JSZip, { JSZipLoadOptions } from 'jszip';
import jschardet from 'jschardet';
import { useEffect, useState } from 'react';
import TreeView, { flattenTree, INode, ITreeViewOnNodeSelectProps } from 'react-accessible-treeview';
import { useTranslation } from 'react-i18next';
import { Breadcrumb, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import * as SubmissionsService from '@/api/instructor/SubmissionsService';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { useSubmission } from '@/hooks/instructor/SubmissionHooks';
import { FileIcon } from '@/pages/InstructorTaskManager/components/StudentCodeViewer/FileIcon';
import { FolderIcon } from '@/pages/InstructorTaskManager/components/StudentCodeViewer/FolderIcon';
import { getExtension } from '@/pages/InstructorTaskManager/utils/StudentCodeViewerUtils';

import '@/pages/InstructorTaskManager/containers/StudentCodeViewer/StudentCodeViewerPage.css';

type Params = {
    id?: string
};

type TreeNode = {
    id: string,
    name: string,
    children: TreeNode[],
    isBranch?: boolean
};

function sortTree(root: TreeNode): TreeNode {
    // Folders come first, then files
    root.children.sort((a, b) => {
        if (a.isBranch === b.isBranch) {
            return 0;
        }
        if (a.isBranch) {
            return -1;
        }
        return 1;
    });
    // Sort recursively (where might be needed)
    root.children
        .filter((c) => c.children.length > 1)
        .forEach((c) => sortTree(c));
    return root;
}

export function StudentCodeViewerPage() {
    const { t } = useTranslation();
    const params = useParams<Params>();
    const id = parseInt(params.id || '-1', 10);
    const submission = useSubmission(id);
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
                    const buffer: Buffer = Array.isArray(filename)
                        ? Buffer.from(filename.map((char) => char.charCodeAt(0)))
                        : Buffer.from(filename);

                    const detected = jschardet.detect(buffer);
                    const encoding = detected?.encoding || 'utf-8';
                    const decoder = new TextDecoder(encoding);

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
        const root: TreeNode = {
            id: 'root',
            name: '',
            children: [],
        };

        jsZip?.forEach((relativePath, zipEntry) => {
            // Split the path to get each component
            const pathParts = relativePath.split('/')
                .filter((part) => part.length);
            let currentPart = root;

            pathParts.forEach((part, index) => {
                // Check if this part of the path already exists in the children
                let child = currentPart.children.find((innerChild) => innerChild.name === part);

                if (!child) {
                    // If it doesn't exist, we create a new child
                    child = {
                        id: pathParts.slice(0, index + 1)
                            .join('/'),
                        name: part,
                        children: [],
                        isBranch: zipEntry.dir,
                    };

                    currentPart.children.push(child);
                }

                currentPart = child;
            });
        });
        setTreeData(flattenTree(sortTree(root)));
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
        <>
            {submission.data && submission.data.task && submission.data.task.group ? (
                <Breadcrumb>
                    <LinkContainer to="/instructor/task-manager">
                        <Breadcrumb.Item>{t('navbar.taskmanager')}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/course-manager/courses/${submission.data.task.group.courseID}`}>
                        <Breadcrumb.Item>{submission.data.task.group.course.name}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/task-manager/groups/${submission.data.task.groupID}`}>
                        <Breadcrumb.Item>{submission.data.task.groupID}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/task-manager/tasks/${submission.data.taskID}`}>
                        <Breadcrumb.Item>{submission.data.task.name}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer
                        to={`/instructor/task-manager/groups/${submission.data.task.groupID}
                        /students/${submission.data.uploaderID}`}
                    >
                        <Breadcrumb.Item>
                            {`${submission.data.uploader.name}(${submission.data.uploader.userCode})`}
                        </Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/task-manager/submissions/${submission.data.id}`}>
                        <Breadcrumb.Item>{submission.data.name ?? submission.data.translatedStatus}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/task-manager/code-viewer/${submission.data.id}`}>
                        <Breadcrumb.Item active>{t('task.viewCode')}</Breadcrumb.Item>
                    </LinkContainer>
                </Breadcrumb>
            ) : null}
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
                                            <FolderIcon
                                                isOpen={isExpanded}
                                                hasChildren={element.children?.length > 0}
                                            />
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
        </>
    );
}

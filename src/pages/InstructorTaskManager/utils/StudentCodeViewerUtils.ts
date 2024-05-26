import { LanguageSupport } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { php } from '@codemirror/lang-php';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { csharp } from '@replit/codemirror-lang-csharp';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import {
    faFileAlt,
    faFileAudio,
    faFileImage,
    faFilePdf,
    faFileVideo,
    faFolder,
    faFolderClosed,
    faFolderOpen,
    faHashtag,
    faX,
} from '@fortawesome/free-solid-svg-icons';
import {
    faCss3Alt,
    faCuttlefish,
    faGithub,
    faHtml5,
    faJava,
    faJs,
    faPhp,
    faPython,
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type FileIconProps = {
    icon: IconDefinition;
    color?: string;
};

export function getExtension(extension: string): LanguageSupport[] {
    switch (extension) {
    case 'js':
        return [javascript()];
    case 'ts':
        return [javascript({ typescript: true })];
    case 'jsx':
        return [javascript({ jsx: true })];
    case 'tsx':
        return [javascript({
            jsx: true,
            typescript: true,
        })];
    case 'py':
        return [python()];
    case 'html':
        return [html()];
    case 'css':
        return [css()];
    case 'php':
        return [php()];
    case 'java':
    case 'gradle':
        return [java()];
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
        return [cpp()];
    case 'cs':
    case 'csproj':
        return [csharp()];
    case 'json':
        return [json()];
    case 'md':
        return [markdown()];
    case 'sql':
        return [sql()];
    case 'xml':
    case 'xaml':
        return [xml()];
    default:
        return [];
    }
}

export function getIconProps(extension: string): FileIconProps {
    switch (extension) {
    case 'pdf':
        return {
            icon: faFilePdf,
            color: 'red',
        };
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
        return {
            icon: faJs,
            color: 'yellow',
        };
    case 'py':
        return {
            icon: faPython,
            color: 'blue',
        };
    case 'html':
        return {
            icon: faHtml5,
            color: 'orange',
        };
    case 'css':
        return {
            icon: faCss3Alt,
            color: 'blue',
        };
    case 'php':
        return {
            icon: faPhp,
            color: 'purple',
        };
    case 'java':
        return {
            icon: faJava,
            color: 'red',
        };
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
        return {
            icon: faCuttlefish,
            color: 'gray',
        };
    case 'cs':
    case 'csproj':
        return {
            icon: faHashtag,
            color: 'green',
        };
    case 'xaml':
        return {
            icon: faX,
            color: 'blue',
        };
    case 'md':
        return {
            icon: faGithub,
            color: 'black',
        };
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
        return {
            icon: faFileImage,
            color: 'green',
        };
    case 'mp4':
    case 'mov':
    case 'avi':
        return {
            icon: faFileVideo,
            color: 'blue',
        };
    case 'mp3':
    case 'wav':
    case 'aac':
        return {
            icon: faFileAudio,
            color: 'orange',
        };
    default:
        return {
            icon: faFileAlt,
            color: 'dark-gray',
        };
    }
}

type IconAndColor = {
    icon: IconDefinition;
    color: string;
};

export function getIconAndColor(isOpen: boolean, hasChildren: boolean): IconAndColor {
    if (hasChildren) {
        return isOpen
            ? {
                icon: faFolderOpen,
                color: 'black',
            }
            : {
                icon: faFolder,
                color: 'black',
            };
    }
    return {
        icon: faFolderClosed,
        color: 'gray',
    };
}

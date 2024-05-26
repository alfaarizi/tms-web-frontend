import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIconProps } from 'pages/InstructorTaskManager/utils/StudentCodeViewerUtils';

type Props = {
    filename: string;
};

export function FileIcon({ filename }: Props) {
    const extension = filename.slice((filename.lastIndexOf('.')) + 1);
    const fileIconProps = getIconProps(extension);

    return (
        <FontAwesomeIcon className="fa-fw" icon={fileIconProps.icon} color={fileIconProps.color} />
    );
}

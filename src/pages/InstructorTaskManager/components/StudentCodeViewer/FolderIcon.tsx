import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIconAndColor } from '@/pages/InstructorTaskManager/utils/StudentCodeViewerUtils';

type Props = {
  isOpen: boolean;
  hasChildren: boolean;
};

export function FolderIcon({ isOpen, hasChildren }: Props) {
    const { icon, color } = getIconAndColor(isOpen, hasChildren);
    return (
        <FontAwesomeIcon className="fa-fw" icon={icon} color={color} />
    );
}

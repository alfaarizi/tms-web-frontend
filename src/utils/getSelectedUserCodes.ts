import { Option } from 'react-bootstrap-typeahead/types/types';
import { User } from 'resources/common/User';

export function getSelectedUserCodes(selectedOptions: Option[]) : string[] {
    const codes : string[] = [];
    for (let i = 0; i < selectedOptions.length; i++) {
        const opt = selectedOptions[i];
        codes.push((opt as User).userCode);
    }
    return codes;
}

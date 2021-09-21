import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Semester } from 'resources/common/Semester';

type Props = {
    onChange: (semester: Semester) => void,
    onRefetch: () => void,
    semesters: Semester[] | undefined,
    selected: Semester | null
}

export function SemesterSwitcher({
    onChange,
    onRefetch,
    semesters,
    selected,
}: Props) {
    return (
        <NavDropdown
            onClick={onRefetch}
            title={(
                <>
                    <FontAwesomeIcon icon={faCalendar} />
                    {' '}
                    {selected?.name || ''}
                </>
            )}
            id="nav-dropdown-semester"

        >
            {
                semesters?.map((semester) => (
                    <NavDropdown.Item
                        key={semester.id}
                        active={semester.id === selected?.id}
                        onSelect={() => onChange(semester)}
                    >
                        {semester.name}
                    </NavDropdown.Item>
                ))
            }
        </NavDropdown>
    );
}
